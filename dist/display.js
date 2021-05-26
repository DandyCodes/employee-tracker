module.exports = function (rows) {
  for (const row of rows) {
    delete row.id;
    for (const key in row) {
      const value = row[key];
      row[titleCase(key)] = titleCase(value);
      delete row[key];
    }
  }
  console.table(rows);
};

function titleCase(originalString) {
  if (originalString === null) return "-";
  if (typeof originalString !== "string") return originalString;
  if (originalString.endsWith("_id")) {
    originalString = originalString.replace("_id", "");
  }
  originalString = originalString.replace("_", " ");
  const words = originalString.split(" ");
  let titleCaseString = "";
  for (const word of words) {
    const wordArray = word.split("");
    wordArray[0] = wordArray[0].toUpperCase();
    titleCaseString += wordArray.join("") + " ";
  }
  return titleCaseString.trim();
}
