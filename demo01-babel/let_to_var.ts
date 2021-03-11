import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

// TODO: 第一步：将code变为ast
const code = "let a = 'let';let b = 2;";
const ast = parse(code, { sourceType: "module" });
// 分析ast对象
// console.log(ast);

// TODO: 第二步，遍历ast，改变其内容
traverse(ast, {
  // 每次进入结点时调用
  enter: item => {
    // 判断当前结点类型是否为变量声明
    if (item.node.type === "VariableDeclaration") {
      if (item.node.kind === "let") {
        // 如果类型是let，则将其变为var
        item.node.kind = "var";
      }
    }
  },
});
// TODO: 第三步，将ast重新变为代码
const res = generate(ast, {}, code);
console.log(res.code);