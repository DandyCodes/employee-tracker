const pluralize = require("pluralize");
const query = require("./query");

module.exports = async function (arrayOfRows, message) {
  const rows = JSON.parse(JSON.stringify(arrayOfRows));
  for (const row of rows) {
    for (const key in row) {
      if (key.endsWith("_id")) {
        const id = row[key];
        const niceKey = key.replace("_id", "");
        const foreignTableName =
          niceKey == "manager" ? "employees" : pluralize(niceKey);
        row[niceKey] = await query.getNiceIdentifierFromID(
          foreignTableName,
          id
        );
        delete row[key];
      }
    }
  }
  for (const row of rows) {
    delete row.id;
    for (const key in row) {
      const value = row[key];
      row[titleCase(key)] = titleCase(value);
      delete row[key];
    }
  }
  console.log("\n", "\t", message.toUpperCase(), "\n");
  console.table(rows);
};

function titleCase(originalString) {
  if (originalString === null) return "-";
  if (typeof originalString !== "string") return originalString;
  let titleCaseString = "";
  const words = originalString.split(" ");
  for (const word of words) {
    const wordArray = word.split("");
    wordArray[0] = wordArray[0].toUpperCase();
    titleCaseString += wordArray.join("") + " ";
  }
  return titleCaseString.trim();
}
