import { loadCdtConfig, Server } from '@deliveroo/create-deliveroo-tool';
import postAuthHook from './hooks/post-auth';
import preAuthHook from './hooks/pre-auth';

const appConfig = loadCdtConfig();
const server = new Server(appConfig, { postAuth: postAuthHook, preAuth: preAuthHook });

server.start();
