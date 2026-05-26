import { connectDatabase } from './config/db.js';
import { ensureDownloadDir } from './utils/files.js';
import { startDownloadWorker } from './workers/downloadWorker.js';

await ensureDownloadDir();
await connectDatabase();
startDownloadWorker();

console.log('Mediazy download worker running');
