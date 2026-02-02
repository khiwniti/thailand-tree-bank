import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// Verification routes (stub for Phase 4)
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Verification scheduling - Coming in Phase 4' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Verification details - Coming in Phase 4' });
});

export default router;
