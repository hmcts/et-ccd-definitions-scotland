const { execFileSync } = require('child_process');
const env = process.argv[2];
if (!env) {
  console.error('Provide an environment parameter');
  process.exit(1);
}

const config = require('./env.json');

if (!config[env]) {
  console.error(`Environment "${env}" not found in env.json`);
  process.exit(1);
}

Object.entries(config[env]).forEach(([k, v]) => {
  process.env[k] = v.startsWith('$') ? process.env[v.slice(1)] : v;
});

const files = process.argv[3];
process.env.ET_ENV = env;
let excludeJson = files === 'prod' ? 'nonprod.json' : 'prod.json';
const args = [  'run',  `generate-excel`,  '-e',  `*-${excludeJson}`];
execFileSync("yarn", args, { encoding: 'utf-8', stdio: 'inherit' })
