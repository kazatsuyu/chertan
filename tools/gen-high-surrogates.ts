import { stdout } from "process";

stdout.write(`// This file is generated by tools/gen-high-surrogates.ts
// To update this file, do \`yarn run gen-high-surrogates\`
export type HighSurrogates = `);

for (let code = 0xd800; code < 0xdc00; code += 1) {
  stdout.write(`| "\\u{${code.toString(16)}}"`);
}

stdout.write(";\n");