// Shared browser tooling for local QA and media preparation.
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { projectPath } from './project-paths.mjs';

const clientPath = projectPath('.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs');
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Use Node 22 ou superior para o QA de navegador.');
if (!existsSync(clientPath)) {
  throw new Error('Instale a skill design-taste-frontend em .agents/skills/ para executar QA e preparar midias. Consulte README.md e skills-lock.json.');
}
const { Browser, sleep, findChrome } = await import(pathToFileURL(clientPath).href);

export function assertBrowserEnvironment() {
  if (!findChrome()) throw new Error('Instale Chrome, Edge ou Chromium, ou configure CHROME_PATH.');
}
// The renderer sandbox cannot start in this Windows execution environment.
// This override applies only to local tooling, never to the application.
const launch = Browser.launch.bind(Browser);
Browser.launch = (options) => launch({
  ...options,
  extraArgs: ['--no-sandbox', ...(options?.extraArgs ?? [])],
});

export { Browser, sleep };
