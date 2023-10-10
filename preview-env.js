const { execFileSync } = require('child_process');

const prId = process.argv[2];
if (!prId) {
  console.error('Provide a PR parameter');
  process.exit(1);
}

console.log(prId);

const vars = {
  ET_COS_URL: `https://et-cos-et-ccd-definitions-admin-pr-${prId}.preview.platform.hmcts.net`,
  CCD_DEF_URL: `https://ccd-data-store-api-et-ccd-definitions-admin-pr-${prId}.preview.platform.hmcts.net`,
  CCD_DEF_AAC_URL: `https://aac-et-ccd-definitions-admin-pr-${prId}.preview.platform.hmcts.net`
};

process.env['ET_ENV'] = 'preview';

Object.entries(vars).forEach(([k, v]) => {
  process.env[k] = v.startsWith('$') ? process.env[v.slice(1)] : v;
});

const args = ['run', `generate-excel`, '-e', '*-prod.json'];
execFileSync("yarn", args, { encoding: 'utf-8', stdio: 'inherit' })
