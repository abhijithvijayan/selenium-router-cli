const { Builder, By, Key, until } = require('selenium-webdriver');
const chalk = require('chalk');

module.exports = (_options) => {
	(async function runDriver() {

		const driver = new Builder().forBrowser('chrome').build();

		try {
			// Open Router config page
			await driver.get('http://10.1.1.1');

			// Clear existing username
			await driver.findElement(By.name('username')).clear();
			// Fill in username
			await driver.findElement(By.name('username')).sendKeys('Abhi');
			// Fill in password & Login
			await driver.findElement(By.name('password')).sendKeys('abhijith', Key.RETURN);

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

			// fill in the form (sample site)
			await driver.findElement(By.xpath('//input[@name="urlFQDN"]')).sendKeys('www.rankyou.com');

      
			// Click on button
			await driver.findElement(By.name('addFQDN')).click();
      
			// Wait until Form is loaded
			await driver.wait(until.elementLocated(By.name('urlFQDN')), 1000);
      
      console.log(chalk.blue('Complete'));
		} finally {
			await driver.quit();
		}
	})();
};
