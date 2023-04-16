import { loadCdtConfig, Server } from '@deliveroo/create-deliveroo-tool';

const appConfig = loadCdtConfig();
const server = new Server(appConfig);

server.start();
