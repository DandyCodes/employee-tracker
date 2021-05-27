module.exports = function (rows, tableName) {
  for (const row of rows) {
    delete row.id;
    for (const key in row) {
      const value = row[key];
      row[titleCase(key)] = titleCase(value);
      delete row[key];
    }
  }
  console.log("\n", "\t", tableName.toUpperCase(), "\n");
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
