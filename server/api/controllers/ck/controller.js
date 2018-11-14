// eslint-disable-next-line no-unused-vars
import logger from '../../../common/logger';
import { createNewPool } from '../../../../connection/index';
import servicedb from '../../services/controller.db.service';

export class Controller {
  async getCustomerZone(req, res) {
    const orgId = req.params.orgId;
    const custId = req.params.clienteId;
    let instanceDb;
    try {
      const pool = await createNewPool();
      instanceDb = await pool.getConnection();
      const final = servicedb.getCustomerData(instanceDb, orgId, custId);
      final.then(value => {
        // console.log('############################', value);
        res.status(200).json(value);
      });
    } catch (error) {
      console.log('Falla en la conexión a base de datos.', error);
    } finally {
      console.log('en finally   -------------------');
      // if (instanceDb) {
      //   instanceDb.close();
      // }
    }
  }
}

export default new Controller();
