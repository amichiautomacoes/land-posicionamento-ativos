// Resolve project files from this module, independently of the working directory.
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
export const projectPath = (...segments) => resolve(projectRoot, ...segments);

export function projectOutputPath(value) {
  const target = projectPath(value);
  const path = relative(projectRoot, target);
  if (!path || path === '..' || path.startsWith('../') || path.startsWith('..\\') || isAbsolute(path)) {
    throw new Error('O diretorio de saida precisa estar dentro deste projeto.');
  }
  return target;
}
