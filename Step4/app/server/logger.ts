import { createLogger } from '@deliveroo/logger';
import { consoleLogger } from '@deliveroo/logger/lib/consoleLogger';

import { name } from '../../package.json';
import { isProduction } from '../env';

const format = isProduction ? 'json' : 'default';
const serverLogger = createLogger(consoleLogger({ format }));

serverLogger.setContext('App', name);
serverLogger.setContext('Logger', 'server');

export default serverLogger;
