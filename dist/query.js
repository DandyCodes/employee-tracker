let connection;

module.exports = {
  config(dbConnection) {
    connection = dbConnection;
  },
  async getAll(tableName) {
    return (await connection.query(`SELECT * FROM ${tableName}`))[0];
  },
  async getRowNameById(tableName, id) {
    if (!id) return null;
    const row = (
      await connection.query(`SELECT * FROM ${tableName} WHERE id=${id}`)
    )[0][0];
    return row.name
      ? row.name
      : row.title
      ? row.title
      : `${row.first_name} ${row.last_name}`;
  },
};
