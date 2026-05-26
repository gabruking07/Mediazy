import { Router } from 'express';
import {
  downloadMedia,
  getCookieDebug,
  getDownloadJobStatus,
  getHistory,
  getInstagramCookieDebug,
  getInstagramProfileMedia,
  getQuota,
  getVideoInfo,
  serveDownloadFile
} from '../controllers/downloadController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/info', getVideoInfo);
router.get('/cookies/debug', getCookieDebug);
router.post('/instagram/profile', getInstagramProfileMedia);
router.get('/instagram/cookies/debug', getInstagramCookieDebug);
router.post('/download', optionalAuth, downloadMedia);
router.get('/download/jobs/:jobId', getDownloadJobStatus);
router.get('/files/:fileName', serveDownloadFile);
router.get('/quota', optionalAuth, getQuota);
router.get('/history', requireAuth, getHistory);

export default router;
