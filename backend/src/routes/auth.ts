import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

/**
 * POST /api/auth/login
 * Authenticate user with LINE ID Token
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { lineIdToken, liffAccessToken } = req.body;

    if (!lineIdToken) {
      return res.status(400).json({ error: 'LINE ID Token is required' });
    }

    // Verify LINE ID Token
    let lineProfile;
    try {
      const verifyResponse = await axios.post(
        'https://api.line.me/oauth2/v2.1/verify',
        new URLSearchParams({
          id_token: lineIdToken,
          client_id: process.env.LIFF_ID || '',
        })
      );

      lineProfile = verifyResponse.data;
    } catch (error) {
      console.error('LINE token verification failed:', error);
      return res.status(401).json({ error: 'Invalid LINE token' });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { lineUserId: lineProfile.sub },
      include: { group: true },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          lineUserId: lineProfile.sub,
          displayName: lineProfile.name,
          pictureUrl: lineProfile.picture,
          email: lineProfile.email,
        },
        include: { group: true },
      });
    } else {
      // Update user profile
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: lineProfile.name,
          pictureUrl: lineProfile.picture,
          email: lineProfile.email,
        },
        include: { group: true },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        lineUserId: user.lineUserId,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        lineUserId: user.lineUserId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl,
        email: user.email,
        phone: user.phone,
        role: user.role,
        group: user.group,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { group: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        lineUserId: user.lineUserId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl,
        email: user.email,
        phone: user.phone,
        role: user.role,
        group: user.group,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side only, token blacklisting can be added)
 */
router.post('/logout', (req: Request, res: Response) => {
  // For now, just return success
  // In production, you might want to blacklist the token in Redis
  res.json({ message: 'Logged out successfully' });
});

export default router;
