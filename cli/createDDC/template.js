const htmlPre = `<app-data-drive`;
const htmlEnd = `</app-data-drive>`;
let f = `[name]="'XXXX'"  [headerCellStyle]="headerSetStyle" [bodyCellStyle]="bodySetStyle"`;

function getHTML({
  name,
  hStyle,
  bStyle
}) {
  let middle = ` [name]="'${name?name:XXX}'"`;
  middle += hStyle ? ` [headerCellStyle]="headerSetStyle"` : '';
  middle += bStyle ? ` [bodyCellStyle]="bodySetStyle"` : '';
  return htmlPre + middle + '>' + htmlEnd;
}
module.exports = {
  getHTML
};
