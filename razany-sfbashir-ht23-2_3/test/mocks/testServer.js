// testServer.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Set up the MSW server with the handlers
export const server = setupServer(...handlers);

