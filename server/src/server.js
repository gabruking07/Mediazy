import app from './app.js';
import { connectDatabase } from './config/db.js';
import { ensureDownloadDir } from './utils/files.js';
import { startCleanupJob } from './utils/cleanup.js';

const port = process.env.PORT || 5000;

await ensureDownloadDir();
await connectDatabase();
startCleanupJob();

app.listen(port, () => {
  console.log(`Mediazy API running on port ${port}`);
});
