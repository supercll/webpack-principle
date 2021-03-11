import { parse } from "@babel/parser";
import * as babel from "@babel/core";
import * as fs from "fs";

const code = fs.readFileSync("./test.js").toString();
console.log(code)
const ast = parse(code, { sourceType: "module" });
// console.log(ast);
const res = babel.transformFromAstSync(ast, code, {
  presets: ["@babel/preset-env"],
});

console.log(res.code)