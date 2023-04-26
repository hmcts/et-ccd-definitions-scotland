const fs = require('fs');

const env = process.argv[2];
if (!env) {
  console.error('Provide an environment parameter');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync('env.json', 'utf-8'));

if (!config[env]) {
  console.error(`Environment "${env}" not found in env.json`);
  process.exit(1);
}

Object.entries(config[env]).forEach(([k, v]) => {
  process.env[k] = v;
});

process.env.ET_ENV = env;
let excludeJson = env === 'prod' ? 'nonprod.json' : 'prod.json';
require('./node_modules/.bin/yarn')([
  'run',
  `generate-excel`,
  '-e',
  '*-${excludeJson}',
]);

