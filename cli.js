#!/usr/bin/env node
'use strict';
const meow = require('meow');
const seleniumRouterCli = require('./index');

const cli = meow(`
	Usage
	  $ selenium-router-cli [input]

	Options
		-v, --version          Show the version and exit with code 0

	Examples
	  $ selenium-router-cli -v
`, {
	flags: {
		boolean: ['version'],
		alias: {
			v: "version"
		}
	}
});

seleniumRouterCli(cli.flags);