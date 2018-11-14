import logger from '../../common/logger';
import { GET_CUSTOMER_ZONE, GET_CUSTOMER_EMAIL, GET_CUSTOMER_PHONE } from '../sql/sql-sentences';

class WrappService {
  async getCustomerData(instanceDb, orgId, custId) {
    let queryResult;
    let customerResponse;
    try {
      // console.log('la sentencia es  ', GET_CUSTOMER_ZONE, [orgId, custId]);
      queryResult = await instanceDb.execute(GET_CUSTOMER_ZONE, [orgId, custId]);
      const arr = queryResult.rows;
      if (arr.length > 0) {
        customerResponse = this.custAssemble(arr, instanceDb);
        logger.info('De vuelta custAssemble');
      } else {
        logger.info('No hay datos disponibles para los parametros dados.');
        customerResponse = {};
      }
    } catch (error) {
      logger.warn('CATCH');
      logger.error(error);
      // falta generar el objeto JSDON de error y enviarselo a res.
    }
    return customerResponse;
  }

  async custAssemble(rowsArray, instanceDb) {
    logger.info('Inicio desde custAssemble');
    const clienteZonaSalida = [];
    const promises = [];
    let queryMail1 = null;
    let queryPhone1 = null;
    let queryMail2 = null;
    let queryPhone2 = null;

    for (let index = 0; index < rowsArray.length; index += 1) {
      const element = rowsArray[index];
      const clientezona = {};
      clientezona.setid = element[0] || '';
      clientezona.cust_id = element[1] || '';
      clientezona.support_teamcd = element[2] || '';
      clientezona.default_flag = element[3] || '';
      clientezona.support_team_mbr = element[5] || '';
      const orgId = clientezona.setid;
      const teamId = clientezona.support_team_mbr;
      try {
        if (element[4] === 'N') { // Verifica sí es Manager
          queryMail1 = await instanceDb.execute(GET_CUSTOMER_EMAIL, [orgId, teamId]);
          queryPhone1 = await instanceDb.execute(GET_CUSTOMER_PHONE, [orgId, teamId]);
          clientezona.name1 = element[6] || '';
          clientezona.emailid2 = (queryMail1.rows > 0) ? queryMail1.rows[0].toString() : '';
          if (queryPhone1.rows.length > 0) {
            clientezona.phone1 = queryPhone1.rows[1] || `${queryPhone1.rows[0]}` || '';
          } else {
            clientezona.phone1 = queryPhone1.rows[0] || '';
          }
          clientezona.support_team_mbr2 = '';
          clientezona.name2 = '';
          clientezona.emailid3 = '';
          clientezona.phone2 = '';
        } else {
          queryMail2 = await instanceDb.execute(GET_CUSTOMER_EMAIL, [orgId, teamId]);
          queryPhone2 = await instanceDb.execute(GET_CUSTOMER_PHONE, [orgId, teamId]);
          clientezona.name1 = '';
          clientezona.emailid2 = '';
          clientezona.phone1 = '';
          clientezona.support_team_mbr2 = clientezona.support_team_mbr;
          clientezona.support_team_mbr = '';
          clientezona.name2 = element[6];
          clientezona.emailid3 = (queryMail2.rows.length > 0) ? queryMail2.rows[0].toString() : '';
          if (queryPhone2.rows.length > 0) {
            clientezona.phone2 = queryPhone2.rows[1] || `${queryPhone2.rows[0]}` || '';
          } else {
            clientezona.phone2 = queryPhone2.rows[0] || '';
          }
        }
      } catch (error) {
        console.log(error);
      }
      clientezona.route_cd = element[7];
      clienteZonaSalida.push(clientezona);
    }
    return clienteZonaSalida;
  }

  objectError(error) {
    return error;
  }
}

export default new WrappService();

