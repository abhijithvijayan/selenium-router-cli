const { Builder, By, Key, until } = require('selenium-webdriver');
const chalk = require('chalk');

module.exports  = () => {
  (async function example() {

    let driver = new Builder()
      .forBrowser('chrome')
      .build();

    try {
      // Open Router config page
      await driver.get('http://10.1.1.1');
      // Clear existing username
      await driver.findElement(By.name('username')).clear();
      await driver.findElement(By.name('username')).sendKeys('Abhi');
      // Login
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
      
      // console.log(chalk.blue('Hello world!'));

    } finally {
      await driver.quit();
    }
  })();
}