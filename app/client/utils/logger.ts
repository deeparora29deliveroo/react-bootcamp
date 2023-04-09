import { createLogger } from '@deliveroo/logger';
import { consoleLogger } from '@deliveroo/logger/lib/consoleLogger';

const format = process.env.PUBLIC_ENVIRONMENT_NAME === 'production' ? 'json' : 'default';
const clientLogger = createLogger(consoleLogger({ format }));

clientLogger.setContext('App', process.env.PUBLIC_APP_NAME);
clientLogger.setContext('Logger', 'client');

export default clientLogger;
