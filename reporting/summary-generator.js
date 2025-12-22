// summary-simple.js
// Minimal Playwright JSON summary generator.
// Usage:   node summary-simple.js [test-results.json]
// Output:  writes test-summary.json and prints final summary JSON to stdout.

const fs = require('fs');
const path = require('path');

const INPUT = process.argv[2] || 'test-results.json';
const OUTPUT = process.env.PLAYWRIGHT_REPORT_SUMMARY_FILE || 'test-summary.json';

function safeLower(s){ return (s||'').toString().toLowerCase(); }
function classify(msg, stack){
  const text = safeLower(msg) + '\n' + safeLower(stack);
  const infra = ['econnrefused','enotfound','connection refused','connection reset','timeout','socket hang up','oom','failed to launch','browser closed','network error','dns'];
  for(const t of infra) if(text.includes(t)) return 'infra';
  const app = ['expected','assert','status code','500','502','503','404','schema validation','ajv','response schema','bad request','validation failed','unauthorized','forbidden'];
  for(const t of app) if(text.includes(t)) return 'app';
  const script = ['typeerror','referenceerror','syntaxerror','cannot read property','cannot find module','uncaught','is not a function','undefined is not'];
  for(const t of script) if(text.includes(t)) return 'script';
  return 'unknown';
}

function collectTestsFromSuites(suites){
  const out = [];
  function walk(s){
    if(!s) return;
    if(Array.isArray(s.tests)){
      for(const t of s.tests){
        out.push({ title: t.title, file: t.file, results: Array.isArray(t.results) ? t.results : (t.runs || []) });
      }
    }
    if(Array.isArray(s.specs)){
      // some Playwright variants nest tests under specs
      for(const sp of s.specs){
        if(Array.isArray(sp.tests)){
          for(const t of sp.tests){
            out.push({ title: t.title, file: t.file || s.file, results: Array.isArray(t.results) ? t.results : (t.runs || []) });
          }
        }
      }
    }
    if(Array.isArray(s.suites)) for(const ss of s.suites) walk(ss);
  }
  for(const su of suites) walk(su);
  return out;
}

try {
  if(!fs.existsSync(INPUT)) {
    console.error(JSON.stringify({ error: `input file not found: ${INPUT}` }));
    process.exit(2);
  }
  const raw = fs.readFileSync(INPUT,'utf8');
  const data = JSON.parse(raw);

  let tests = [];
  if (Array.isArray(data.suites)) tests = collectTestsFromSuites(data.suites);
  else if (Array.isArray(data.tests)) tests = data.tests.map(t => ({ title: t.title, file: t.file, results: Array.isArray(t.results)?t.results:(t.runs||[]) }));
  else if (Array.isArray(data.entries)) {
    for (const e of data.entries) if (e.test) tests.push({ title: e.test.title, file: e.test.file, results: Array.isArray(e.test.results)?e.test.results:(e.test.runs||[]) });
  }

  let total=0, passed=0, failed=0, skipped=0;
  const failures = [];
  for(const t of tests){
    const results = Array.isArray(t.results)?t.results:([]);
    for(const r of results){
      total++;
      const status = (r.status || r.outcome || '').toString().toLowerCase();
      if(status === 'passed') passed++;
      else if(status === 'skipped') skipped++;
      else if(status === 'flaky') passed++;
      else {
        failed++;
        const err = r.error || r.errors || {};
        const message = err?.message || err?.value || r.message || '';
        const stack = err?.stack || '';
        const category = classify(message, stack);
        failures.push({ testTitle: t.title, file: t.file, category, message: String(message).slice(0,800) });
      }
    }
  }

  const failures_by_category = failures.reduce((a,f)=>{ a[f.category]=(a[f.category]||0)+1; return a; },{});
  const summary = { timestamp: new Date().toISOString(), total, passed, failed, skipped, failures_by_category };

  fs.writeFileSync(OUTPUT, JSON.stringify(summary, null, 2), 'utf8');
  // print only the summary JSON (single output, no extra logs)
  console.log(JSON.stringify(summary));
  process.exit(0);
} catch (err) {
  console.error(JSON.stringify({ error: err.message || String(err) }));
  process.exit(1);
}
