import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseExecutionOptions, resolveServerUrl } from '../../scripts/lib/execution-context.mjs';
import { projectPath, projectOutputPath } from '../../scripts/lib/project-paths.mjs';
import { browserSuites, runSuites, selectSuites } from '../../scripts/qa/run-browser-tests.mjs';

test('explicit URL wins over environment; Python PORT supplies the fallback', () => {
  const env = { ...process.env, PORT: '5632', LANDING_BASE_URL: 'http://127.0.0.1:5631/' };
  assert.equal(resolveServerUrl('http://127.0.0.1:5630', env), 'http://127.0.0.1:5630/');
  assert.equal(resolveServerUrl(undefined, env), 'http://127.0.0.1:5631/');
  delete env.LANDING_BASE_URL;
  assert.equal(resolveServerUrl(undefined, env), 'http://127.0.0.1:5632/');
  assert.throws(() => resolveServerUrl('file:///tmp/page', env), /HTTP/);
});

test('commands accept named options and reject unsupported input', () => {
  const named = parseExecutionOptions(['--url=http://127.0.0.1:5630/', '--out', 'reports/qa/sample']);
  assert.equal(named.url, 'http://127.0.0.1:5630/');
  assert.equal(named.output, 'reports/qa/sample');
  assert.throws(() => parseExecutionOptions(['--url']), /valor/);
  assert.throws(() => parseExecutionOptions(['--unknown']), /desconhecida/);
  assert.throws(() => parseExecutionOptions(['http://localhost/']), /posicionais/);
});

test('project files and output remain stable outside the working directory', () => {
  const original = process.cwd();
  const expected = projectOutputPath('reports/qa/sample');
  try {
    process.chdir(projectPath('docs'));
    assert.equal(projectOutputPath('reports/qa/sample'), expected);
    assert.ok(readFileSync(projectPath('docs/content/faq.md'), 'utf8').includes('### 1.'));
    assert.throws(() => projectOutputPath('../outside'), /dentro/);
    assert.throws(() => projectOutputPath('.'), /dentro/);
  } finally { process.chdir(original); }
});

test('runner selects canonical suites and records failures while continuing', () => {
  assert.equal(browserSuites.length, 9);
  assert.deepEqual(selectSuites(['faq', 'faq']), ['faq']);
  assert.throws(() => selectSuites(['unknown']), /desconhecida/);
  const output = mkdtempSync(projectPath('reports/qa/runner-contract-'));
  const children = [
    { status: 1, stdout: '', stderr: 'assertion failed' },
    { status: 0, stdout: 'passed', stderr: '' },
    { status: null, signal: 'SIGTERM', error: new Error('timeout') },
  ];
  try {
    const results = runSuites({ suites: ['faq', 'landing', 'card-stack'], url: 'http://127.0.0.1:5630/', output }, () => children.shift());
    assert.deepEqual(results.map(result => result.status), ['failed', 'passed', 'failed']);
    assert.equal(children.length, 0);
    assert.equal(results[2].exitCode, null);
    const summary = JSON.parse(readFileSync(resolve(output, 'results.json'), 'utf8'));
    assert.deepEqual(summary.results, results);
    assert.equal(summary.status, 'failed');
    assert.match(readFileSync(resolve(output, 'card-stack/stderr.log'), 'utf8'), /timeout/);
  } finally { rmSync(projectOutputPath(output), { recursive: true }); }
});
