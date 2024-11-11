import { fromMarkdown } from "mdast-util-from-markdown";
import * as mdx from "mdast-util-mdx";
import { mdxjs } from "micromark-extension-mdxjs";
import "./style.css";
import { micromark } from "micromark";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

/**
 * some usefull links
 * - https://unifiedjs.com/
 * - https://unifiedjs.com/learn/guide/introduction-to-unified/
 * - https://unifiedjs.com/learn/guide/introduction-to-syntax-trees/
 * - https://unifiedjs.com/learn/guide/syntax-trees-typescript/
 * - https://unifiedjs.com/learn/recipe/tree-traversal/
 */
const TT = `
## h2
lorem ipsin
<TT id="01" tasks={[{a:"1",b:"1"},{a:"2",b:"2"}]}/>
<TT id="02" tasks={
  [
    {a:"1",b:"1"},
    {a:"2",b:"2"}
  ]
}/>
other text
<TT id="03" tasks={[{a:"1",b:"1"},{a:"2",b:"2"}]}/>

- lit
- lit
- lit
`;

const onUpdatePropertyOnMdx = (
  tagName: string, // TaskList
  property: string, // tasks
  value: string, // `[]`
  selector: string // #01 https://github.com/syntax-tree/unist-util-select
) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(() => {
      return (tree) => {
        console.log("tree");
        // Aquí podrías modificar el AST si lo deseas
      };
    });

  const astx = processor.parse(TT);

  console.log(1, { astx });
  // visit(astx , (node) => { // ℹ️ use this to access to all nodes: https://unifiedjs.com/learn/recipe/tree-traversal/
  visit(astx, "mdxJsxFlowElement", (node) => {
    console.log("tree:", { node });
  });
  console.log(2, { astx });
};

onUpdatePropertyOnMdx("TT", "tasks", '[{a:"1e",b:"1e"},{a:"2",b:"2"}]', "#01");

// Procesamos el Markdown con JSX y lo convertimos en un AST
// const astWithJSX = processor.parse(markdownWithJSX);

// console.log(micromark(TT, { extensions: [mdxjs()] }));

// const newValue: string = `[
//     {a:"1",b:"1"},
//     {a:"2",b:"2"}
//   ]`;

// function modifyMdxProperty(
//   mdxContent: string,
//   componentName: string,
//   property: string,
//   newValue: string
// ) {
//   // Parsear el contenido MDX a un AST (Abstract Syntax Tree)
//   const parsedMdx = parseSync(mdxContent);

//   // Recorrer el árbol y buscar el componente deseado
//   const modifiedMdx = parsedMdx.children.map((node) => {
//     // Si el nodo es un componente de tipo JSX (como <ComponentePropiedades />)
//     if (node.type === "jsx" && node.value.includes(componentName)) {
//       // Reemplazar la propiedad específica del componente
//       const newJsx = node.value.replace(
//         new RegExp(`${property}="[^"]+"`), // Regex para encontrar la propiedad
//         `${property}="${newValue}"` // Reemplazar con el nuevo valor
//       );
//       return { ...node, value: newJsx }; // Retornar el nodo modificado
//     }
//     return node;
//   });

//   // Reconstruir el MDX con los cambios
//   const modifiedMdxContent = modifiedMdx
//     .map((node) => node.value || "")
//     .join("\n");
//   return modifiedMdxContent;
// }

// const $ = cheerio.load(TT);
// console.log({ html: $.html() });

// const attr = $("#2").attr("tasks");
// console.log({ attr: attr });
// // const attrJSON = JSON.parse(attr);
