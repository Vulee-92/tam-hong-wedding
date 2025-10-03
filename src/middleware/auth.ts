import { NextApiRequest, NextApiResponse } from 'next';
import { verify, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtData extends JwtPayload {
  role: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtData;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies['auth-token'] || req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'Vui lòng đăng nhập để tiếp tục' 
        });
      }

      try {
        const decoded = verify(token, JWT_SECRET) as JwtData;
        req.user = decoded;
        return await handler(req, res);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false,
            message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' 
          });
        }
        return res.status(401).json({ 
          success: false,
          message: 'Token không hợp lệ' 
        });
      }
    } catch (error) {
      console.error('[Auth Middleware Error]:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi xác thực, vui lòng thử lại sau' 
      });
    }
  };
} 