# selenium-router-cli [![npm version](https://img.shields.io/npm/v/selenium-router-cli)](https://www.npmjs.com/package/selenium-router-cli)

> Automate Router Domain Blacklisting for DLink Router

<h3>🙋‍♂️ Made by <a href="https://twitter.com/_abhijithv">@abhijithvijayan</a></h3>
<p>
  Donate:
  <a href="https://www.paypal.me/iamabhijithvijayan" target='_blank'><i><b>PayPal</b></i></a>,
  <a href="https://www.patreon.com/abhijithvijayan" target='_blank'><i><b>Patreon</b></i></a>
</p>
<p>
  <a href='https://www.buymeacoffee.com/abhijithvijayan' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png' border='0' alt='Buy Me a Coffee' />
  </a>
</p>
<hr />

### Warning

This CLI is tested only on Dlink DIR-600M. Do not use the CLI if your router is of a different model id.

## Requirements 

Chrome Driver is required to run the CLI. For installation instructions, visit [here](https://chromedriver.chromium.org/getting-started).

## Install

Ensure you have [Node.js](https://nodejs.org) 8 or later installed. Then run the following:

```
$ npm install --global selenium-router-cli
```

## Usage

```
$ selenium-router-cli --help

  Automate Router Domain Blacklisting for DLink Router

  Options
		-u, --username TEXT    Router Dashboard username
		-p, --password TEXT    Router Dashboard password
		-g, --gateway TEXT	   Router Gateway IP
		-v, --version          Show the version and exit with code 0

	Examples
		$ selenium-router-cli --username "ROUTER_USERNAME" --password "ROUTER_PASSWORD"
		$ selenium-router-cli -u "ROUTER_USERNAME" -p "ROUTER_PASSWORD" -g "10.1.1.2"
```

## Dashboard

![Image](screenshot.png)

## License

MIT © [Abhijith Vijayan](https://abhijithvijayan.in)
