const { GoogleSpreadsheet } = require('google-spreadsheet');
 
function fatalError(err) {
  console.log(err);
  process.exit(-1);
}

const sheetID = process.env.sheet || fatalError('must specify sheet in env');


// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet(sheetID);
 

// OR load directly from json file if not in secure environment
await doc.useServiceAccountAuth(require('./credentials.json'));

 
await doc.loadInfo(); // loads document properties and worksheets
console.log(doc.title);
 