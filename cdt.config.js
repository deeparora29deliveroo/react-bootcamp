const { openUrlWithPumaDev } = require('@deliveroo/create-deliveroo-tool');
const { createLogger } = require('@deliveroo/logger');
const { consoleLogger } = require('@deliveroo/logger/lib/consoleLogger');

const pkg = require('./package.json');
const { isProduction, env } = require('./app/env');

const format = isProduction ? 'json' : 'default';
const cdtLogger = createLogger(consoleLogger({ format }));

cdtLogger.setContext('App', pkg.name);
cdtLogger.setContext('Logger', 'cdt');

// All configuration options can be seen in the CDT documentation -> https://github.com/deliveroo/create-deliveroo-tool/blob/master/docs/generated/modules.md

let environmentVariables = {
  // The PUBLIC_ prefix is to make env vars accessible (at build step) to the
  // frontend application, otherwise only the server will be able to access them
  PUBLIC_ENVIRONMENT_NAME: env,
  PUBLIC_APP_NAME: pkg.name,
};

if (isProduction) {
  // We set these environment variables only when ENVIRONMENT_NAME is defined,
  // to avoid CDT validation errors while for the test and dev environments

  environmentVariables = {
    ...environmentVariables,
    // This environment variable is defined in Terraform/CircleCI, accessible at
    // the Docker build phase
    PUBLIC_EXAMPLE_BUILD_ENV_VAR: process.env.EXAMPLE_BUILD_ENV_VAR,
  };
}

const config = {
  appName: pkg.name,
  isProduction,
  serverConfig: {
    customServer: {
      development: './app/server/index.ts',
      production: './dist/app/server/index.js',
    },
    enableSecurity: true,
    securityOptions: {
      crossOriginEmbedderPolicy: false,
    },
    enableAuth: isProduction,
    openUrl: openUrlWithPumaDev('cdt-created-app.deliveroo.net'),
  },
  clientConfig: {
    typeScript: { enabled: true }, // MUST REMAIN ON ONE LINE UNTIL TS/JS CHOICE MADE
    environmentVariables,
  },
};

// All internal apps that will be accessed by a .net or .com domain (available to the outside world) should have
// authentication enabled. This template warns you if you've not configured it to push you in that direction.
// To set up authentication via SSO, please see documentation:
// https://github.com/deliveroo/app-template-react/blob/master/docs/getting-your-app-into-production.md#setting-up-authentication
if (!config.serverConfig.enableAuth) {
  cdtLogger.error(
    new Error('Authentication is not enabled. Remove this if this is setup correctly'),
  );
}

module.exports = config;
