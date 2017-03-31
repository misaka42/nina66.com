const fs = require('fs');
const path = require('path');
const dataJSONPath = path.join(__dirname, './data.json');

function avg(arr) {
  return arr.reduce((a, b) => a + b) / arr.length;
}

exports.config = {
  name: 'calculate bou circle'
}


exports.run = function () {
  const dataJSON = JSON.parse(fs.readFileSync(dataJSONPath, 'utf8'));
  const arr = dataJSON.circle;
  const offsets = [];

  for (let i = 0; i < arr.length; i++) {
    let curr = new Date(arr[i]);
    let prev = new Date(arr[i - 1] ? arr[i - 1] : arr[i]);
    let offset = (curr - prev) / 1000 / 60 / 60 / 24;
    if (offset >= 25 && offset <= 35) {
      offsets.push(offset);
    }
  }

  const avgOffset = avg(offsets);

  for (let i = 0; i < 7; i++) {
    const pre = new Date(new Date(arr[arr.length - 1]).getTime() + avgOffset * 1000 * 60 * 60 * 24);
    arr.push(pre)
    console.log(pre.toLocaleDateString())
  }
}