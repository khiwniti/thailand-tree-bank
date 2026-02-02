import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * GET /api/plots
 * Get all plots for current user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const plots = await prisma.plot.findMany({
      where: { ownerId: userId },
      include: {
        trees: true,
        documents: true,
        _count: {
          select: {
            trees: true,
            documents: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ plots, total: plots.length });
  } catch (error) {
    console.error('Get plots error:', error);
    res.status(500).json({ error: 'Failed to fetch plots' });
  }
});

/**
 * GET /api/plots/:id
 * Get plot by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const plot = await prisma.plot.findFirst({
      where: {
        id,
        ownerId: userId,
      },
      include: {
        trees: {
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        group: true,
        owner: {
          select: {
            id: true,
            displayName: true,
            pictureUrl: true,
          },
        },
      },
    });

    if (!plot) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    res.json({ plot });
  } catch (error) {
    console.error('Get plot error:', error);
    res.status(500).json({ error: 'Failed to fetch plot' });
  }
});

/**
 * POST /api/plots
 * Create new plot
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, areaRai, areaNgan, areaWa, centerLat, centerLng, boundary } = req.body;

    // Calculate areaSqm
    const areaSqm = parseFloat(areaRai) * 1600 +
                    (areaNgan ? parseFloat(areaNgan) * 400 : 0) +
                    (areaWa ? parseFloat(areaWa) * 4 : 0);

    const plot = await prisma.plot.create({
      data: {
        ownerId: userId,
        name,
        areaRai: parseFloat(areaRai),
        areaNgan: areaNgan ? parseFloat(areaNgan) : null,
        areaWa: areaWa ? parseFloat(areaWa) : null,
        areaSqm,
        centerLat: parseFloat(centerLat),
        centerLng: parseFloat(centerLng),
        boundary: boundary || null,
      },
      include: {
        trees: true,
        documents: true,
      },
    });

    res.status(201).json({ plot });
  } catch (error) {
    console.error('Create plot error:', error);
    res.status(500).json({ error: 'Failed to create plot' });
  }
});

/**
 * PUT /api/plots/:id
 * Update plot
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const updateData = req.body;

    // Verify ownership
    const existingPlot = await prisma.plot.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existingPlot) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    // Update plot
    const plot = await prisma.plot.update({
      where: { id },
      data: updateData,
      include: {
        trees: true,
        documents: true,
      },
    });

    res.json({ plot });
  } catch (error) {
    console.error('Update plot error:', error);
    res.status(500).json({ error: 'Failed to update plot' });
  }
});

/**
 * DELETE /api/plots/:id
 * Delete plot
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    // Verify ownership
    const existingPlot = await prisma.plot.findFirst({
      where: { id, ownerId: userId },
    });

    if (!existingPlot) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    // Delete plot (cascade deletes trees and documents)
    await prisma.plot.delete({
      where: { id },
    });

    res.json({ message: 'Plot deleted successfully' });
  } catch (error) {
    console.error('Delete plot error:', error);
    res.status(500).json({ error: 'Failed to delete plot' });
  }
});

export default router;
