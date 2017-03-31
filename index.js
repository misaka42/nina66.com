const fs = require('fs');
const path = require('path');

fs.readdirSync('./tasks').filter(fileName => path.extname(fileName) === '.js').forEach(file => {
  const task = require(path.join(__dirname, './tasks', file));
  console.log(`----< task begin >---- ${task.config.name}\n`);
  const startDate = new Date();
  task.run();
  const costs = new Date() - startDate;
  console.log(`----< task finished, costs: ${costs} ms >---- ${task.config.name}\n`);
});
