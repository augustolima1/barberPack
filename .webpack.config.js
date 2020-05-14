const { addBabelPlugin, override } = require("customize-cra");

module.exports = config => {
  config.target = "electron-renderer";
  return config;
};

module.exports = override(
  addBabelPlugin([
    "babel-plugin-root-import",
    {
      rootPathSuffix: "src"
    }
  ])
);
