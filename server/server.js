const express = require("express");
const promBundle = require("express-prom-bundle");
const path = require("path");
const mustacheExpress = require("mustache-express");
const getDecorator = require("./dekorator");
const buildPath = path.resolve(__dirname, "../build");
const basePath = "/innloggingsinfo";
const logger = require("./logger");
const server = express();

const prometheus = promBundle({
  includePath: true,
  metricsPath: `${basePath}/internal/metrics`
});

server.set("views", `${__dirname}/../build`);
server.set("view engine", "mustache");
server.engine("html", mustacheExpress());

server.use(express.json());
server.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

server.get(`${basePath}/internal/isAlive`, (req, res) =>
  res.sendStatus(200)
);

server.get(`${basePath}/internal/isReady`, (req, res) =>
  res.sendStatus(200)
);

server.use(prometheus);

server.use(basePath, express.static(buildPath, {
  index: false
}));

// Match everything except internal og static
server.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) =>
  getDecorator()
    .then(fragments => {
      res.render("index.html", fragments);
    })
    .catch(e => {
      const error = `Failed to get decorator: ${e}`;
      logger.error(error);
      res.status(500).send(error);
    })
);

const port = process.env.PORT || 8080;
server.listen(port, () => logger.info(`App listening on port: ${port}`));

process.on("SIGTERM", () =>
  setTimeout(() => logger.info("Har sovet i 30 sekunder"), 30000)
);
