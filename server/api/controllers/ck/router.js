import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/setid/:orgId/clientes/:clienteId', controller.getCustomerZone);
