// Health check API endpoint
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple health check
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'The FUND Frontend',
    version: '1.0.0',
  });
}