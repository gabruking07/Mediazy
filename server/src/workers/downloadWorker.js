import dotenv from 'dotenv';
import { Worker } from 'bullmq';
import { createRedisConnection, isRedisConfigured } from '../config/redis.js';
import { executeDownload } from '../controllers/downloadController.js';

dotenv.config();

const queueName = process.env.DOWNLOAD_QUEUE_NAME || 'mediazy-downloads';

let worker;

export const startDownloadWorker = () => {
  if (worker || !isRedisConfigured() || process.env.DOWNLOAD_WORKER_ENABLED === 'false') {
    return worker;
  }

  worker = new Worker(
    queueName,
    async (job) => executeDownload(job.data),
    {
      connection: createRedisConnection(),
      concurrency: Number(process.env.DOWNLOAD_WORKER_CONCURRENCY || 2)
    }
  );

  worker.on('completed', (job) => {
    console.log(`Download job completed: ${job.id}`);
  });

  worker.on('failed', (job, error) => {
    console.error(`Download job failed: ${job?.id}`, error.message);
  });

  return worker;
};
