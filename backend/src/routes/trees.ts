import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Apply auth middleware
router.use(authMiddleware);

/**
 * POST /api/trees
 * Add new tree
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { plotId, lat, lng, treeType, status, plantedDate, dbhCm, heightM, photoUrl, notes } = req.body;

    const tree = await prisma.tree.create({
      data: {
        plotId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        treeType,
        status,
        plantedDate: new Date(plantedDate),
        dbhCm: dbhCm ? parseFloat(dbhCm) : null,
        heightM: heightM ? parseFloat(heightM) : null,
        photoUrl,
        notes,
      },
    });

    res.status(201).json({ tree });
  } catch (error) {
    console.error('Create tree error:', error);
    res.status(500).json({ error: 'Failed to create tree' });
  }
});

/**
 * POST /api/trees/batch
 * Batch create trees (for offline sync)
 */
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { trees } = req.body;

    if (!Array.isArray(trees)) {
      return res.status(400).json({ error: 'Trees must be an array' });
    }

    const createdTrees = await prisma.$transaction(
      trees.map((tree) =>
        prisma.tree.create({
          data: {
            plotId: tree.plotId,
            lat: parseFloat(tree.lat),
            lng: parseFloat(tree.lng),
            treeType: tree.treeType,
            status: tree.status,
            plantedDate: new Date(tree.plantedDate),
            dbhCm: tree.dbhCm ? parseFloat(tree.dbhCm) : null,
            heightM: tree.heightM ? parseFloat(tree.heightM) : null,
            photoUrl: tree.photoUrl,
            notes: tree.notes,
          },
        })
      )
    );

    res.status(201).json({ trees: createdTrees, count: createdTrees.length });
  } catch (error) {
    console.error('Batch create trees error:', error);
    res.status(500).json({ error: 'Failed to create trees' });
  }
});

/**
 * PUT /api/trees/:id
 * Update tree
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const tree = await prisma.tree.update({
      where: { id },
      data: updateData,
    });

    res.json({ tree });
  } catch (error) {
    console.error('Update tree error:', error);
    res.status(500).json({ error: 'Failed to update tree' });
  }
});

/**
 * DELETE /api/trees/:id
 * Delete tree
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tree.delete({
      where: { id },
    });

    res.json({ message: 'Tree deleted successfully' });
  } catch (error) {
    console.error('Delete tree error:', error);
    res.status(500).json({ error: 'Failed to delete tree' });
  }
});

/**
 * GET /api/trees/:id/history
 * Get tree history (multi-layer tracking)
 */
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const history = await prisma.treeHistory.findMany({
      where: { treeId: id },
      include: {
        user: {
          select: {
            displayName: true,
            pictureUrl: true,
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
    });

    res.json({ history });
  } catch (error) {
    console.error('Get tree history error:', error);
    res.status(500).json({ error: 'Failed to fetch tree history' });
  }
});

export default router;
