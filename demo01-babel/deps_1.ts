// 使用 node -r ts-node/register 文件路径 来运行，
// 如果需要调试，可以加一个选项 --inspect-brk，再打开 Chrome 开发者工具，点击 Node 图标即可调试
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { readFileSync } from "fs";
import { resolve, relative, dirname } from "path";
/* 
代码思路
1. 调用collectCodeAndDeps("index.js")
2. 先把 depRelation['index.js'] 初始化为 { deps: [], code: 'index.js的源码' }
3. 然后把 index.js 源码 code 变成 ast
4. 遍历 ast，看看 import 了哪些依赖，假设依赖了 a.js 和 b.js
5. 把 a.js 和 b.js 写到 depRelation['index.js'].deps 里
6. 最终得到的 depRelation 就收集了 index.js 的依赖

*/

// 设置根目录
const projectRoot = resolve(__dirname, "project_1");
// 类型声明，依赖关系
type DepRelation = { [key: string]: { deps: string[]; code: string } };
// 初始化一个空的 depRelation，用于收集依赖
const depRelation: DepRelation = {};

// 将入口文件的绝对路径传入函数，如 D:\demo\fixture_1\index.js
// 收集源代码和依赖
collectCodeAndDeps(resolve(projectRoot, "index.js"));

console.log(depRelation);
console.log("done");

function collectCodeAndDeps(filepath: string) {
  const key = getProjectPath(filepath); // 文件的项目路径，如 index.js
  // 获取文件内容，将内容放至 depRelation
  const code = readFileSync(filepath).toString();
  // 初始化 depRelation[key]
  depRelation[key] = { deps: [], code: code };
  // 将代码转为 AST
  const ast = parse(code, { sourceType: "module" });
  // 分析文件依赖，将内容放至 depRelation
  traverse(ast, {
    enter: path => {
      if (path.node.type === "ImportDeclaration") {
        // path.node.source.value 往往是一个相对路径，如 ./a.js，需要先把它转为一个绝对路径
        const depAbsolutePath = resolve(dirname(filepath), path.node.source.value);
        // 然后转为项目路径
        const depProjectPath = getProjectPath(depAbsolutePath);
        // 把依赖写进 depRelation
        depRelation[key].deps.push(depProjectPath);
      }
    },
  });
}
// 获取文件相对于根目录的相对路径
function getProjectPath(path: string) {
  return relative(projectRoot, path).replace(/\\/g, "/");
}
