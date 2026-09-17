const builder = require('./builder');
builder.rebuildDomain(1)
  .then(() => builder.rebuildDomain(2))
  .then(() => console.log('All domains built OK'))
  .catch(console.error);
