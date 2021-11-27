const Fastify = require("fastify");

// import redirects from "./redirects.json";
const ROOT_DOMAIN = "riv.alumni.com";

function build() {
  const fast = Fastify({ http2: true, logger: true, trustProxy: true });

  fast.get("/", (req, res) => {
    // if (!req.hostname.includes(ROOT_DOMAIN)) return res.send(403);
    return res.send(
      `Hostname: ${req.hostname} || Authority: ${
        req.headers[":authority"]
      } || riv.alumni check: ${req.hostname.includes(ROOT_DOMAIN)}`
    );
  });

  return fast;
}

async function start() {
  const IS_GOOGLE_CLOUD_RUN = process.env.K_SERVICE !== undefined;

  const SERVER_ADDRESS = IS_GOOGLE_CLOUD_RUN ? "::" : undefined;
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
