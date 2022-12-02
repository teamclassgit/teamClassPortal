const SassRuleRewire = require("react-app-rewire-sass-rule");
const path = require("path");
const rewireAliases = require("react-app-rewire-aliases");

module.exports = function override (config, env) {
  require("react-app-rewire-postcss")(config, {
    plugins: loader => [require("postcss-rtl")()]
  });

  config = rewireAliases.aliasesOptions({
    "@src": path.resolve(__dirname, "src"),
    "@assets": path.resolve(__dirname, "src/@core/assets"),
    "@components": path.resolve(__dirname, "src/@core/components"),
    "@layouts": path.resolve(__dirname, "src/@core/layouts"),
    "@store": path.resolve(__dirname, "src/redux"),
    "@styles": path.resolve(__dirname, "src/@core/scss"),
    "@configs": path.resolve(__dirname, "src/configs"),
    "@data": path.resolve(__dirname, "src/data"),
    "@utils": path.resolve(__dirname, "src/utility/Utils"),
    "@hooks": path.resolve(__dirname, "src/utility/hooks"),
    "@utility": path.resolve(__dirname, "src/utility"),
    "@services": path.resolve(__dirname, "src/services"),
    "@graphql": path.resolve(__dirname, "src/graphql"),
    "@atoms": path.resolve(__dirname, "src/components/atoms"),
    "@molecules": path.resolve(__dirname, "src/components/molecules"),
    "@organisms": path.resolve(__dirname, "src/components/organisms")
  })(config, env);

  config = new SassRuleRewire()
    .withRuleOptions({
      test: /\.s[ac]ss$/i,
      use: [
        {
          loader: "sass-loader",
          options: {
            sassOptions: {
              includePaths: ["node_modules", "src/assets"]
            }
          }
        }
      ]
    })
    .rewire(config, env);

  return config;
};
