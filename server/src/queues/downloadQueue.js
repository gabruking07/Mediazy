import { Queue, QueueEvents } from 'bullmq';
import { createRedisConnection, isRedisConfigured } from '../config/redis.js';

const queueName = process.env.DOWNLOAD_QUEUE_NAME || 'mediazy-downloads';
const queueEnabled = process.env.DOWNLOAD_QUEUE_ENABLED !== 'false';

let queue;
let queueEvents;

export const isDownloadQueueEnabled = () => queueEnabled && isRedisConfigured();

export const getDownloadQueue = () => {
  if (!isDownloadQueueEnabled()) {
    return null;
  }

  if (!queue) {
    queue = new Queue(queueName, {
      connection: createRedisConnection(),
      defaultJobOptions: {
        attempts: Number(process.env.DOWNLOAD_JOB_ATTEMPTS || 2),
        backoff: {
          type: 'exponential',
          delay: Number(process.env.DOWNLOAD_JOB_BACKOFF_MS || 3000)
        },
        removeOnComplete: {
          age: Number(process.env.DOWNLOAD_JOB_COMPLETE_TTL_SECONDS || 3600),
          count: Number(process.env.DOWNLOAD_JOB_COMPLETE_COUNT || 1000)
        },
        removeOnFail: {
          age: Number(process.env.DOWNLOAD_JOB_FAILED_TTL_SECONDS || 86400)
        }
      }
    });
  }

  return queue;
};

export const getDownloadQueueEvents = () => {
  if (!isDownloadQueueEnabled()) {
    return null;
  }

  if (!queueEvents) {
    queueEvents = new QueueEvents(queueName, {
      connection: createRedisConnection()
    });
  }

  return queueEvents;
};

export const addDownloadJob = async (data) => {
  const downloadQueue = getDownloadQueue();
  if (!downloadQueue) return null;

  return downloadQueue.add('download', data);
};

export const getDownloadJob = async (jobId) => {
  const downloadQueue = getDownloadQueue();
  if (!downloadQueue) return null;

  return downloadQueue.getJob(jobId);
};
