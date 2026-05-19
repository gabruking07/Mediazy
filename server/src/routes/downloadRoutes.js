import { Router } from 'express';
import {
  downloadMedia,
  getHistory,
  getQuota,
  getVideoInfo,
  serveDownloadFile
} from '../controllers/downloadController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/info', getVideoInfo);
router.post('/download', optionalAuth, downloadMedia);
router.get('/files/:fileName', serveDownloadFile);
router.get('/quota', optionalAuth, getQuota);
router.get('/history', requireAuth, getHistory);

export default router;
