import oracledb from 'oracledb';
// eslint-disable-next-line import/prefer-default-export
export function createNewPool() {
  return new Promise((resolve, reject) => {
    try {
      resolve(oracledb.getPool(process.env.APP));
    } catch (error) {
      oracledb.createPool({
        poolAlias: process.env.APP,
        poolMax: process.env.ORACLEDB_POOL_MAX || 30,
        user: process.env.ORACLEDB_USER || '',
        password: process.env.ORACLEDB_PASS || '',
        connectString: process.env.ORACLEDB_CONN || '',
      }, (errorPool, newPool) => {
        if (errorPool) {
          reject(errorPool);
        }
        return resolve(newPool);
      });
    }
  });
}
