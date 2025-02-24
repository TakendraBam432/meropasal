
import { supabase } from "@/integrations/supabase/client";

// Rate limiting implementation
const rateLimits = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per minute

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit) {
    rateLimits.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimits.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
};

// Basic fraud detection
export const detectFraudRisk = async (order: {
  buyer_id: string;
  total_amount: number;
  shipping_address: any;
}): Promise<{ risk: 'low' | 'medium' | 'high'; reason?: string }> => {
  try {
    // Check order history for this user
    const { data: previousOrders } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('buyer_id', order.buyer_id)
      .order('created_at', { ascending: false });

    if (!previousOrders) return { risk: 'medium', reason: 'Unable to verify history' };

    // Risk factors
    const hasRecentOrders = previousOrders.some(
      (o) => new Date(o.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );
    const averageOrderAmount = previousOrders.reduce((sum, o) => sum + o.total_amount, 0) / (previousOrders.length || 1);
    const isHighValueOrder = order.total_amount > averageOrderAmount * 3;

    if (isHighValueOrder && !previousOrders.length) {
      return { risk: 'high', reason: 'High value first-time order' };
    }

    if (isHighValueOrder && hasRecentOrders) {
      return { risk: 'medium', reason: 'Multiple high-value orders in short period' };
    }

    return { risk: 'low' };
  } catch (error) {
    console.error('Error in fraud detection:', error);
    return { risk: 'medium', reason: 'Unable to complete risk assessment' };
  }
};

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "img-src 'self' data: https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};
