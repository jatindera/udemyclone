const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    // apply proxy in dev mode
    if (dev) {
        server.use('/api', createProxyMiddleware(
            {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        ));
    }
    server.all('*', (req, res) => handle(req, res));
    server.listen(3000, () => console.log('Server listening on port 3000'));

}).catch((err) => {
    console.error(err.stack);
    process.exit(1);
}
);

