const fs = require('fs');
const http = require('axios');
const base = 'http://cn.bing.com';
const path = require('path');
const dataJSON = path.join(__dirname, './data.json');

exports.config = {
  name: 'fetch images from bing.com'
}

exports.run = function () {

  http.get(base + '/HPImageArchive.aspx', {
    params: {
      format: 'js',
      idx: 0,
      n: 100
    }
  }).then(res => {
    return res.data.images.map(img => base + img.url)
  }).then(imgs => {
    let dataStr = fs.readFileSync(dataJSON, { encoding: 'utf8' });
    if (!dataStr) { dataStr = '{}'; }

    const data = JSON.parse(dataStr);
    if (!data.images) { data.images = [] }

    const len = data.images.length;

    imgs.forEach(url => {
      if (data.images.indexOf(url) === -1) {
        data.images.push(url);
      }
    })

    console.log('update finished, count: ' + (data.images.length - len));

    fs.writeFileSync(dataJSON, JSON.stringify(data, null, 2));

    return data.images;
  }).then(imgs => {
    const html = fs.readFileSync('./photos.html', { encoding: 'utf8' });
    const ul = '<ul>\n' + imgs.map(url => `    <li><img x-src="${url}"></li>\n`).join('') + '  </ul>';
    const newHtml = html.replace(/<ul>[^]*<\/ul>/i, ul);

    fs.writeFileSync('./photos.html', newHtml);
  }).catch(ex => {
    console.error(ex);
  })
}
