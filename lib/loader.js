import { promises as fs } from 'node:fs';
import vm from 'node:vm';

const loader = (options) => async (filePath, sandbox) => {
  const src = await fs.readFile(filePath, 'utf8');
  const code = `
    'use strict';
    const sandbox = this;
    let __exports = {};
    ${src.replace(/export default/, '__exports =')}
    __exports;
  `;
  const script = new vm.Script(code);
  const sanboxFrozen = Object.freeze(sandbox);
  const context = vm.createContext(sanboxFrozen);
  const exported = script.runInContext(context, {
    ...options,
    displayErrors: true,
  });
  return exported;
};

export default loader;
