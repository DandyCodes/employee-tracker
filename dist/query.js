let connection;

module.exports = {
  config(dbConnection) {
    connection = dbConnection;
  },
  async getTableNames() {
    return (await connection.query(`SHOW TABLES`))[0].map(
      row => row.Tables_in_employee_db
    );
  },
  async getAllRows(tableName) {
    return (await connection.query(`SELECT * FROM ${tableName}`))[0];
  },
  async getNiceIdentifierFromID(tableName, id) {
    if (!id) return null;
    const row = await this.getRowById(tableName, id);
    return row.name
      ? row.name
      : row.title
      ? row.title
      : `${row.first_name} ${row.last_name}`;
  },
  async getRowById(tableName, id) {
    return (
      await connection.query(`SELECT * FROM ${tableName} WHERE id=${id}`)
    )[0][0];
  },
  async updateColumnValue(tableName, columnName, newValue, rowId) {
    await connection.query(
      `UPDATE ${tableName} SET ${columnName} = ${newValue} WHERE id=${rowId}`
    );
  },
  async getColumnNames(tableName) {
    return (await connection.query(`SHOW COLUMNS FROM ${tableName}`))[0]
      .map(column => column.Field)
      .filter(columnName => columnName !== "id");
  },
  async addRow(tableName, columnNames, values) {
    await connection.query(
      `INSERT INTO ${tableName} (${columnNames.join(",")}) VALUES (${values
        .map(value =>
          Number.isNaN(Number(value)) ? `"${value}"` : Number(value)
        )
        .join(",")})`
    );
  },
  async removeRowById(tableNameInWhichToRemoveRow, id) {
    const foreignKeyName =
      tableNameInWhichToRemoveRow === "departments"
        ? "department_id"
        : tableNameInWhichToRemoveRow === "roles"
        ? "role_id"
        : "manager_id";
    const allTableNames = await this.getTableNames();
    let canBeDeleted = true;
    for (const tableName of allTableNames) {
      const rows = await this.getAllRows(tableName);
      for (const row of rows) {
        if (row[foreignKeyName] === id) {
          if (foreignKeyName === "manager_id") {
            await this.updateColumnValue(
              tableName,
              foreignKeyName,
              null,
              row.id
            );
          } else {
            canBeDeleted = false;
          }
        }
      }
    }
    if (canBeDeleted) {
      await connection.query(
        `DELETE FROM ${tableNameInWhichToRemoveRow} WHERE id=${id}`
      );
    } else {
      console.log(
        `
!!!---YOU CANNOT REMOVE ${tableNameInWhichToRemoveRow.toUpperCase()} WHICH OTHER ENTRIES RELY UPON---!!!`
      );
    }
  },
};
