import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getExecutionContext, parseExecutionOptions } from '../lib/execution-context.mjs';
import { projectPath, projectRoot } from '../lib/project-paths.mjs';

export const browserSuites = Object.freeze([
  'landing', 'interactions', 'card-stack', 'horizontal-journey',
  'benefits-flow', 'process-rail', 'faq', 'section-transitions', 'typography-reflow',
]);

export function selectSuites(requested = []) {
  const names = requested.length ? [...new Set(requested)] : [...browserSuites];
  for (const name of names) {
    if (!browserSuites.includes(name)) throw new Error(`Suite desconhecida: ${name}. Use --list.`);
  }
  return names;
}

// Keep orchestration separate from the CLI and from individual test scenarios.
export function runSuites({ suites, url, output }, execute = spawnSync) {
  const results = [];
  const startedAt = new Date().toISOString();
  const writeSummary = status => writeFileSync(resolve(output, 'results.json'), JSON.stringify({
    url, status, startedAt, updatedAt: new Date().toISOString(), results,
  }, null, 2) + '\n');
  writeSummary('running');
  for (const [index, name] of suites.entries()) {
    console.log(`[${index + 1}/${suites.length}] ${name}`);
    const directory = resolve(output, name);
    mkdirSync(directory, { recursive: true });
    const startedAt = new Date().toISOString();
    const child = execute(process.execPath, [projectPath(`tests/browser/${name}.mjs`), '--url', url, '--out', directory], {
      cwd: projectRoot, env: process.env, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
    });
    const passed = child.status === 0 && !child.error;
    writeFileSync(resolve(directory, 'stdout.log'), child.stdout || '');
    writeFileSync(resolve(directory, 'stderr.log'), (child.stderr || '') + (child.error ? `\n${child.error.message}` : ''));
    results.push({ name, status: passed ? 'passed' : 'failed', exitCode: child.status ?? null,
      signal: child.signal ?? null, startedAt, finishedAt: new Date().toISOString() });
    writeSummary('running');
    console.log(`  ${passed ? 'PASS' : 'FAIL'}: ${name}`);
  }
  writeSummary(results.some(result => result.status === 'failed') ? 'failed' : 'passed');
  return results;
}

export async function main(args = process.argv.slice(2)) {
  let context;
  try {
    const options = parseExecutionOptions(args);
    if (options.help) {
      console.log('node scripts/qa/run-browser-tests.mjs [--url URL] [--out OUTPUT] [--suite NAME,...] [--list]');
      console.log('URL: --url > LANDING_BASE_URL > PORT de app/config.py. O servidor precisa estar ativo.');
      return 0;
    }
    if (options.list) { console.log(browserSuites.join('\n')); return 0; }
    const suites = selectSuites(options.suites);
    context = getExecutionContext('reports/qa/browser-suite', options);
    mkdirSync(context.output, { recursive: true });
    writeFileSync(resolve(context.output, 'results.json'), JSON.stringify({
      url: context.url, status: 'preflight', startedAt: new Date().toISOString(), results: [],
    }, null, 2) + '\n');
    const { assertBrowserEnvironment } = await import('../lib/browser.mjs');
    assertBrowserEnvironment();
    let response;
    try { response = await fetch(context.url, { signal: AbortSignal.timeout(5000) }); }
    catch { throw new Error('Nao foi possivel acessar a landing. Inicie o servidor e confira --url / LANDING_BASE_URL.'); }
    const html = await response.text();
    if (!response.ok || !html.includes('data-design-system="ativos"')) {
      throw new Error('A URL nao respondeu com a landing Ativos. Inicie o servidor e confira --url / LANDING_BASE_URL.');
    }
    const results = runSuites({ ...context, suites });
    const failed = results.filter(result => result.status === 'failed').length;
    console.log(`${results.length - failed}/${results.length} suites passaram. Evidencias: ${context.output}`);
    return failed ? 1 : 0;
  } catch (error) {
    console.error(`QA interrompido: ${error.message}`);
    if (context) writeFileSync(resolve(context.output, 'results.json'), JSON.stringify({
      url: context.url, status: 'preflight-failed', error: error.message, results: [],
    }, null, 2) + '\n');
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await main();
}
