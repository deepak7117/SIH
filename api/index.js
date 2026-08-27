import app from '../server/app.js';

// Vercel Node.js runtime treats a default-exported Express app
// as a request handler, so no extra wiring is needed here.
export default app;
