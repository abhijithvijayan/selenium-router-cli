#!/usr/bin/env node

const meow = require('meow');
const seleniumRouterCli = require('./');

const cli = meow(
	`
	Usage
	  $ selenium-router-cli [input]

	Options
		-u, --username TEXT    Router Dashboard username
		-p, --password TEXT    Router Dashboard password
		-g, --gateway TEXT	 	 Router Gateway IP
		-v, --version          Show the version and exit with code 0

	Examples
		$ selenium-router-cli --username "ROUTER_USERNAME" --password "ROUTER_PASSWORD"
		$ selenium-router-cli -u "ROUTER_USERNAME" -p "ROUTER_PASSWORD" -g "10.1.1.2"
`,
	{
		flags: {
			boolean: ['version'],
			string: ['username', 'password', 'gateway'],
			alias: {
				u: 'username',
				p: 'password',
				v: 'version',
				g: 'gateway',
			},
		},
	}
);

seleniumRouterCli(cli.flags);
