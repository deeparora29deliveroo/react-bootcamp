const { createLogger } = require('@deliveroo/logger');
const { consoleLogger } = require('@deliveroo/logger/lib/consoleLogger');

const { name } = require('./package.json');
const { isProduction } = require('./app/env');

const format = isProduction ? 'json' : 'default';
const webpackLogger = createLogger(consoleLogger({ format }));

webpackLogger.setContext('App', name);
webpackLogger.setContext('Logger', 'webpack');

// eslint-disable-next-line no-unused-vars
module.exports = (webpackConfig, appConfig) => {
  webpackLogger.warn(
    "The webpackConfig hook is enabled in ~/cdt.config.js. Remove this hook if you don't need it. See more info at https://github.com/deliveroo/create-deliveroo-tool#custom-webpack-configuration",
  );

  return webpackConfig;
};
