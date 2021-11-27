// const Fastify = require('fastify');
import Fastify from 'fastify';
const redirects = require('./redirects.json');

const ROOT_DOMAIN = 'riv-alumni.com';

function build() {
  const fast = Fastify({ http2: true, logger: true, trustProxy: true });

  fast.get('/', (req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    const redirect = redirects[subdomain];

    if (!req.hostname.includes(ROOT_DOMAIN)) return res.code(403);
    if (!redirect || !redirect['enabled']) return res.code(404);
    return res.redirect(301, redirect['linkTo']);
  });

  return fast;
}

async function start() {
  const IS_GOOGLE_CLOUD_RUN = process.env.K_SERVICE !== undefined;

  const SERVER_ADDRESS = IS_GOOGLE_CLOUD_RUN ? '::' : undefined;
  const SERVER_PORT = process.env.PORT || 3000;

  try {
    const server = build();
    const address = await server.listen(SERVER_PORT, SERVER_ADDRESS);

    console.log(`Listening on ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = build;
if (require.main === module) start();
