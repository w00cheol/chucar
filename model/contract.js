const con = require('../config/connection');
const qry = require('../config/query');
const pool = con.init();
con.check(pool);

module.exports = {
  search: async (filter) => {
    searchContractSql = qry.searchContract(filter);
    try {
      rows = await con.selectQuery(searchContractSql, pool);
      return(rows);
    }
    catch(err) {return err;}
  },


}