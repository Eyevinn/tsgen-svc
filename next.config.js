const isProd = process.env.NODE_ENV === 'production';

const env = {
  API_BASE_URL: isProd ? '/api/v1' : process.env.API_BASE_URL || '/api/v1',
};

console.log(env);

module.exports = {
  env: env,
  assetPrefix: isProd ? '/web' : ''
}
