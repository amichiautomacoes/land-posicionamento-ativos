// Shared CLI and server configuration for QA and media commands.
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectPath, projectRoot, projectOutputPath } from './project-paths.mjs';

export function parseExecutionOptions(args = process.argv.slice(2)) {
  const options = { suites: [] };
  for (let index = 0; index < args.length; index++) {
    const [flag, ...inline] = args[index].split('=');
    if (['--url', '--out', '--suite'].includes(flag)) {
      const value = inline.length ? inline.join('=') : args[++index];
      if (!value || value.startsWith('--')) throw new Error(`Informe um valor para ${flag}.`);
      if (flag === '--suite') options.suites.push(...value.split(',').filter(Boolean));
      else options[flag === '--url' ? 'url' : 'output'] = value;
    } else if (['--help', '--list', '--print-context'].includes(flag)) {
      options[flag.slice(2)] = true;
    } else if (args[index].startsWith('--')) {
      throw new Error(`Opcao desconhecida: ${args[index]}`);
    } else throw new Error('Use --url URL e --out PASTA. Argumentos posicionais nao sao aceitos.');
  }
  return options;
}

export function resolveServerUrl(explicitUrl, env = process.env) {
  let value = explicitUrl || env.LANDING_BASE_URL;
  if (!value) {
    const python = projectPath(process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python');
    if (!existsSync(python)) {
      throw new Error('Crie .venv com requirements/development.txt ou informe --url / LANDING_BASE_URL.');
    }
    const config = spawnSync(python, ['-c', "from app.config import load_config; print(load_config()['PORT'])"], {
      cwd: projectRoot, env, encoding: 'utf8', timeout: 10000,
    });
    const port = Number(config.stdout?.trim());
    if (config.status !== 0 || !Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('Nao foi possivel ler PORT em app/config.py. Confira .venv, as dependencias e a configuracao.');
    }
    value = `http://127.0.0.1:${port}/`;
  }
  let url;
  try { url = new URL(value); } catch { throw new Error('Informe uma URL HTTP ou HTTPS valida.'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Informe uma URL HTTP ou HTTPS valida.');
  return url.href;
}

export function getExecutionContext(defaultOutput, options = parseExecutionOptions()) {
  return { url: resolveServerUrl(options.url), output: projectOutputPath(options.output || defaultOutput), options };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const options = parseExecutionOptions();
    if (!options['print-context']) throw new Error('Use --print-context [--url URL] [--out OUTPUT].');
    const { url, output } = getExecutionContext('reports/qa/inspect', options);
    console.log(JSON.stringify({ url, output }));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
