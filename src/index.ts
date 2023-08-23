import 'dotenv/config';
import { createServerAdapter } from '@whatwg-node/server';
import { createServer } from 'http';
import 'isomorphic-fetch';
import { handler } from './handler';

const server = createServerAdapter(handler);
const httpServer = createServer(server);
httpServer.listen(parseInt(process.env.SHAPER_PORT ?? '5801'));
