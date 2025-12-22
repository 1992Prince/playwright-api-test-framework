import type { FullConfig } from '@playwright/test';

function generateRunId(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const msPart = now.getMilliseconds();
  return `RUN_${datePart}_${timePart}_${msPart}`;
}

async function globalSetup(_config: FullConfig) {
  // Only set the RUN_ID here (no console logging—report won't capture it anyway)
  process.env.RUN_ID = generateRunId();
}

export default globalSetup;


// // global-setup.ts
// import type { FullConfig } from '@playwright/test';
// import { consoleLogger } from './utils/consoleLoggerSingletonInstance';


// function generateRunId(): string {
//   // Create a clean, readable Run ID with underscores only
//   // Example: RUN_20251107_100531_123
//   const now = new Date();
//   const pad = (n: number) => String(n).padStart(2, '0');
  
//   const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
//   const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
//   const msPart = now.getMilliseconds();
  
//   return `RUN_${datePart}_${timePart}_${msPart}`;
// }

// async function globalSetup(_config: FullConfig) {
//   // 1️⃣ Generate the Run ID
//   const runId = generateRunId();

//   // 2️⃣ Store it in environment variable (process.env)
//   // process.env is a Node.js global object shared by all modules
//   process.env.RUN_ID = runId;

//   // 3️⃣ Print it once for reference
//   consoleLogger.info(`\n============================`);
//   consoleLogger.info(`✅ Test Execution Started`);
//   consoleLogger.info(`🆔 RUN_ID: ${runId}`);
//   consoleLogger.info(`============================\n`);
// }

// export default globalSetup;
