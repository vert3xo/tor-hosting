import * as webpack from "webpack";
import * as path from "path";

export default {
  mode: "production",
  target: "electron-main",
  resolve: { extensions: [".ts"] },
  entry: "./src/electron.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
} as webpack.Configuration;
