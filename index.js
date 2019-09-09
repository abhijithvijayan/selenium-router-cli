const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const ghGot = require('gh-got');
const { promisify } = require('util');
const lineReader = require('line-reader');
const { Builder, By, Key, until } = require('selenium-webdriver');

const pkg = require('./package.json');

const options = {};

const validate = _options => {
	if (
		Object.prototype.hasOwnProperty.call(_options, 'username') ||
		Object.prototype.hasOwnProperty.call(_options, 'u')
	) {
		options.username = _options.username || _options.u;
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'password') ||
		Object.prototype.hasOwnProperty.call(_options, 'p')
	) {
		options.password = _options.password || _options.p;
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'gateway') ||
		Object.prototype.hasOwnProperty.call(_options, 'g')
	) {
		options.gateway = _options.gateway || _options.g;
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'version') ||
		Object.prototype.hasOwnProperty.call(_options, 'v')
	) {
		options.version = _options.version || _options.v;
	}
	return null;
};

const flashError = message => {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
};

const writeJSONContent = async content => {
	const spinner = ora('Creating hosts file locally').start();

	try {
		await promisify(fs.writeFile)('hosts.json', content);
		spinner.succeed('JSON file created locally');
	} catch (err) {
		spinner.fail('Failed to create JSON file');
		flashError(err);
	}
	spinner.stop();
};

module.exports = _options => {
	validate(_options);

	const { username, password, version, gateway = '10.1.1.1' } = options;

	if (version) {
		console.log(chalk.bold.green(pkg.version));
		return;
	}

	if (!username) {
		flashError('Error! username is a required field.');
		return;
	}

	if (!password) {
		flashError('Error! password is a required field.');
		return;
	}

	// Get data from GitHub

	(async function getData() {
		const spinner = ora('Fetching hosts...').start();

		try {
			// Fetch hosts content
			const { body } = await ghGot('/repos/StevenBlack/hosts/contents/data/StevenBlack/hosts');

			spinner.succeed('Fetched hosts successfully');

			console.warn(chalk.default(body));
			// Write file locally
			// await writeJSONContent(body);
		} catch (err) {
			spinner.fail(chalk.default(err.body && err.body.message));
		}
		spinner.stop();
	})();

	(async function runDriver() {
		const spinner = ora('Selenium running...').start();

		const driver = new Builder().forBrowser('chrome').build();

		try {
			// Open Router config page
			await driver.get(`http://${gateway}`);

			spinner.info('Using credentials to log in...');

			// Clear existing username
			await driver.findElement(By.name('username')).clear();
			// Fill in username
			await driver.findElement(By.name('username')).sendKeys(username);
			// Fill in password & Login
			await driver.findElement(By.name('password')).sendKeys(password, Key.RETURN);

			spinner.succeed('Logged in');

			// Switch to frame that has navbar
			await driver.switchTo().frame(1);

			// Wait until Advanced Tab Link is loaded
			await driver.wait(until.elementLocated(By.linkText('Advanced')), 1000);

			// Click on Advanced Link
			await driver.findElement(By.linkText('Advanced')).click();

			// Wait until URL Block Link is loaded
			await driver.wait(until.elementLocated(By.linkText('URL Block')), 1000);

			// Click on URL Block Link
			await driver.findElement(By.linkText('URL Block')).click();

			// Wait until Form is loaded
			await driver.wait(until.elementLocated(By.name('urlFQDN')), 1000);

			// Implicitly wait for the input to be interactable
			await driver.sleep(1000);

			spinner.succeed('Navigated to page');
			spinner.stop();

			spinner.start('Adding sites...');

			// fill in the form (sample site)
			await driver.findElement(By.xpath('//input[@name="urlFQDN"]')).sendKeys('www.rankyou.com');

			// Click on button
			await driver.findElement(By.name('addFQDN')).click();

			// Wait until Form is loaded
			await driver.wait(until.elementLocated(By.name('urlFQDN')), 1000);

			spinner.succeed('Sites added successfully');
		} finally {
			spinner.info('Process completed...');
			spinner.stop();

			await driver.quit();
		}
	})();
};
