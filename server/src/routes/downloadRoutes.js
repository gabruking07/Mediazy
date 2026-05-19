import { Router } from 'express';
import {
  downloadMedia,
  getHistory,
  getQuota,
  getVideoInfo,
  serveDownloadFile
} from '../controllers/downloadController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/info', getVideoInfo);
router.post('/download', requireAuth, downloadMedia);
router.get('/files/:fileName', serveDownloadFile);
router.get('/quota', requireAuth, getQuota);
router.get('/history', requireAuth, getHistory);

export default router;
