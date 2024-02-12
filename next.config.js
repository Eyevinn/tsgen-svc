const isProd = process.env.NODE_ENV === "production";

const env = {
  API_BASE_URL: isProd ? "/api/v1" : process.env.API_BASE_URL || "/api/v1"
};

console.log(env);

const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
module.exports = withCSS(
  withSass({
    images: {
      disableStaticImages: true
    },
    env: env,
    assetPrefix: isProd ? "/web" : "",
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 100000
          }
        }
      });
      

      return config;
    }
  })
);
