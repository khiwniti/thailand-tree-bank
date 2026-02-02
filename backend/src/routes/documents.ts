import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// Document upload routes (stub)
router.post('/upload', (req, res) => {
  res.status(501).json({ message: 'Document upload - Coming soon' });
});

router.post('/:id/ocr', (req, res) => {
  res.status(501).json({ message: 'OCR processing - Coming soon' });
});

export default router;
