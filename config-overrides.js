/*eslint-disable */
const path = require("path");
const { configPaths, alias} = require("react-app-rewire-alias");

module.exports = function override (config, env) {
    alias({
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
    "@redux": path.resolve(__dirname, "src/redux"),
    "@utility": path.resolve(__dirname, "src/utility"),
    "@services": path.resolve(__dirname, "src/services"),
    "@context": path.resolve(__dirname, "src/context"),
    "@graphql": path.resolve(__dirname, "src/graphql"),
    "@atoms": path.resolve(__dirname, "src/components/atoms"),
    "@molecules": path.resolve(__dirname, "src/components/molecules"),
    "@organisms": path.resolve(__dirname, "src/components/organisms")
  })(config, env);

  const sassRule = config.module.rules.find(
    (rule) => rule.test && rule.test.toString().includes(".scss")
  );

  if (sassRule) {

    sassRule.use = [
      "style-loader",
      "css-loader",
      {
        loader: "sass-loader",
        options: {
          implementation: require("sass"), // Use Dart Sass
          sassOptions: {
            includePaths: path.resolve(__dirname, "src/assets", "src", "scss"),
            indentedSyntax: false
          }
        }
      }
    ];
  }

  return config;
};