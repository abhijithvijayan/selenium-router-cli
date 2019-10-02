const meow = require('meow');
const seleniumRouterCli = require('../index');

let optionMock;

beforeEach(() => {
	optionMock = meow(
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
				version: {
					type: 'boolean',
					alias: 'v',
				},
				username: {
					type: 'string',
					alias: 'u',
					default: '',
				},
				password: {
					type: 'string',
					alias: 'p',
					default: '',
				},
				gateway: {
					type: 'string',
					alias: 'g',
					default: '',
				},
			},
		}
	);
});

describe('seleniumRouterCli.validate', () => {
	it('should add flags to seleniumRouterCli.otions', () => {
		seleniumRouterCli.validate(optionMock.flags);

		expect(seleniumRouterCli.options).toMatchObject({
			version: optionMock.flags.version,
			username: optionMock.flags.username,
			password: optionMock.flags.password,
			gateway: optionMock.flags.gateway,
		});
	});

	it('should not add flags to seleniumRouterCli.otions', () => {
		seleniumRouterCli.validate({});

		expect(seleniumRouterCli.options).toMatchObject({});
	});
});
