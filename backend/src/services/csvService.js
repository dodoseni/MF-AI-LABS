const { stringify } = require("csv-stringify/sync");

/**
 * Generate a CSV string from an array of records.
 * @param {string[]} columns - column headers, in order.
 * @param {Array<object>} rows - objects whose keys match `columns`.
 */
function toCsv(columns, rows) {
  return stringify(rows, {
    header: true,
    columns,
  });
}

module.exports = { toCsv };
