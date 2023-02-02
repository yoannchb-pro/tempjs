const ts = require("rollup-plugin-ts");

const pkg = require("./package.json");
const config = require("./tsconfig.json");

module.exports = {
  input: "./index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: pkg.name,
      sourcemap: true,
    },
  ],
  plugins: [ts(config)],
};
