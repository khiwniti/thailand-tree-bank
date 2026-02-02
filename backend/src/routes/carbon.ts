import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

const CARBON_CREDIT_FACTOR = 9.5; // kg per tree per year
const CARBON_MARKET_PRICE_THB = 300; // THB per kg (approximate)

/**
 * GET /api/carbon/plots/:plotId
 * Calculate carbon credits for a plot
 */
router.get('/plots/:plotId', async (req: Request, res: Response) => {
  try {
    const { plotId } = req.params;

    // Get plot with trees
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
      include: {
        trees: true,
      },
    });

    if (!plot) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    // Calculate carbon
    const healthyTreesCount = plot.trees.filter((t) => t.status === 'HEALTHY').length;
    const carbonKgPerYear = healthyTreesCount * CARBON_CREDIT_FACTOR;
    const estimatedValueThb = carbonKgPerYear * CARBON_MARKET_PRICE_THB;

    // Save calculation
    const carbonCredit = await prisma.carbonCredit.create({
      data: {
        plotId,
        calculationDate: new Date(),
        healthyTreesCount,
        carbonKgPerYear,
        estimatedValueThb,
        status: 'CALCULATED',
      },
    });

    res.json({
      plotId,
      calculationDate: carbonCredit.calculationDate,
      healthyTreesCount,
      carbonKgPerYear: parseFloat(carbonCredit.carbonKgPerYear.toString()),
      estimatedValueThb: parseFloat(carbonCredit.estimatedValueThb?.toString() || '0'),
      formula: `${healthyTreesCount} trees × ${CARBON_CREDIT_FACTOR} kg/tree/year = ${carbonKgPerYear} kg/year`,
    });
  } catch (error) {
    console.error('Calculate carbon error:', error);
    res.status(500).json({ error: 'Failed to calculate carbon credits' });
  }
});

export default router;
