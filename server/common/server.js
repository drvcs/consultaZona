import fs from 'fs';
import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';

const app = new Express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));
  }

  router(routes) {
    swaggerify(app, routes);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = p => () => l.info(`Inicializado microservicio Colcomercio. 
    Ejecutando en ambiente ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} en el puerto: ${p}}`);

    const options = {
      pfx: fs.readFileSync(process.env.CERT_PATH),
      passphrase: process.env.CERT_PASSPHRSE,
      secureProtocol: process.env.SECURE_PROTOCOL,
    };

    https.createServer(options, app).listen(port, welcome(port));
    return app;
  }
}
