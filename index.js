const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const ghGot = require('gh-got');
const { promisify } = require('util');
const lineReader = require('line-reader');
const { Builder, By, Key, until } = require('selenium-webdriver');

const pkg = require('./package.json');

const options = {};
const domainList = [];

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

const writeRawData = async content => {
	const spinner = ora('Decoding file contents...').start();

	const decoded = await Buffer.from(content, 'base64').toString('utf8');

	spinner.succeed('Decoding successfull');
	spinner.stop();

	spinner.start('Creating hosts file locally');

	try {
		await promisify(fs.writeFile)('hosts.md', decoded);
		spinner.succeed('Hosts file created locally');
	} catch (err) {
		spinner.fail('Failed to create file');
		flashError(err);
	}
	spinner.stop();
};

const performParsing = async () => {
	const spinner = ora('Extracting domains...').start();

	let count = 0;
	/** https://regex101.com/r/xGkY1f/1 */
	const regExp = /(?<=0\.0\.0\.0 |127\.0\.0\.1 )(.[^\s#]*)/g;

	const eachLine = await promisify(lineReader.eachLine);
	// read all lines and extract domain
	eachLine('hosts.md', function(line) {
		const domain = line.match(regExp);
		if (domain) {
			// push to array
			domainList.push(domain[0]);
			count += 1;
		}
	})
		.then(function() {
			spinner.succeed(`Extracted ${count} domains`);
		})
		.catch(function(err) {
			flashError(err);
		});
};

module.exports = async _options => {
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
	}

	let content = {};

	// Get data from GitHub
	async function getData() {
		const spinner = ora('Fetching hosts...').start();
		try {
			({
				body: { content },
			} = await ghGot('/repos/StevenBlack/hosts/contents/data/StevenBlack/hosts'));

			spinner.succeed('Fetched hosts successfully');
		} catch (err) {
			spinner.fail(chalk.default(err.body && err.body.message));
		}
		spinner.stop();
	}

	// Fetch hosts content
	await getData();

	// Write file locally
	await writeRawData(content);

	// Parse data to json
	await performParsing();

	async function runDriver() {
		const spinner = ora('Selenium running...').start();

		const driver = new Builder().forBrowser('chrome').build();

		try {
			// Open Router config page
			await driver.get(`http://${gateway}`);

			spinner.stop();
			spinner.start('Using credentials to log in...');

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

			// Limit is 64 for Dlink DIR-600M
			const slicedList = domainList.slice(0, 65);

			let sitesCount = 0;

			for (let index = 0; index < slicedList.length; index += 1) {
				// fill in the form
				await driver.findElement(By.xpath('//input[@name="urlFQDN"]')).sendKeys(slicedList[index]);

				// Click on button
				await driver.findElement(By.name('addFQDN')).click();

				// Wait until Form is loaded
				await driver.wait(until.elementLocated(By.name('urlFQDN')), 1000);

				await driver.sleep(1500);

				sitesCount += 1;
			}

			spinner.succeed(`${sitesCount} Sites added successfully`);
		} finally {
			spinner.succeed('Process completed...');
			spinner.stop();

			await driver.quit();
		}
	}

	await runDriver();
};
