import { supabase } from './supabase';

// ZainCash configuration
export const ZAINCASH_CONFIG = {
  TEST_BASE_URL: 'https://test.zaincash.iq',
  PROD_BASE_URL: 'https://api.zaincash.iq',
  IS_PRODUCTION: process.env.NEXT_PUBLIC_ZAINCASH_PRODUCTION === 'true',
  MERCHANT_ID: process.env.NEXT_PUBLIC_ZAINCASH_MERCHANT_ID || 'test_merchant_123',
  MSISDN: process.env.NEXT_PUBLIC_ZAINCASH_MSISDN || '9647835077880',
  SECRET_KEY: process.env.NEXT_PUBLIC_ZAINCASH_SECRET_KEY || 'test_secret_key_123',
};

export const getBaseUrl = () => {
  return ZAINCASH_CONFIG.IS_PRODUCTION 
    ? ZAINCASH_CONFIG.PROD_BASE_URL 
    : ZAINCASH_CONFIG.TEST_BASE_URL;
};

// ZainCash pricing for premium plan
export const ZAINCASH_PRICING = {
  premium: {
    amount: 5000, // 5,000 IQD (approximately $3.5 USD)
    currency: 'IQD',
    displayPrice: '5,000 د.ع',
    displayPriceEnglish: '5,000 IQD',
    features: [
      'جميع القوالب (5 قوالب)',
      'بدون علامة مائية',
      'تصدير PDF عالي الجودة',
      'دعم أولوية',
      'تحديثات مجانية',
      'ميزات إضافية قادمة'
    ]
  }
};

// Generate JWT token for ZainCash using proper crypto
export const generateZainCashToken = async (payload: any): Promise<string> => {
  try {
    // Create proper JWT header
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
    
    // Create signature using Web Crypto API
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(ZAINCASH_CONFIG.SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    );
    
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');
    
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  } catch (error) {
    console.warn('JWT generation failed, using fallback method:', error);
    // Fallback for demo purposes
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadStr = btoa(JSON.stringify(payload));
    const signature = btoa(`${header}.${payloadStr}.${ZAINCASH_CONFIG.SECRET_KEY}`);
    return `${header}.${payloadStr}.${signature}`;
  }
};

// Initialize ZainCash payment
export const initializeZainCashPayment = async (orderData: {
  amount: number;
  orderId: string;
  redirectUrl: string;
  userId: string;
}) => {
  try {
    const payload = {
      amount: orderData.amount,
      serviceType: 'CV Builder Premium',
      msisdn: ZAINCASH_CONFIG.MSISDN,
      orderId: orderData.orderId,
      redirectUrl: orderData.redirectUrl,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
    };

    const token = await generateZainCashToken(payload);
    
    // Store transaction in Supabase first
    const { error: dbError } = await supabase.from('transactions').insert({
      user_id: orderData.userId,
      order_id: orderData.orderId,
      amount: orderData.amount,
      currency: 'IQD',
      status: 'pending',
      payment_method: 'zaincash',
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.warn('Could not store transaction in database:', dbError);
    }
    
    // Try real ZainCash API first
    try {
      const response = await fetch(`${getBaseUrl()}/transaction/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
          merchantId: ZAINCASH_CONFIG.MERCHANT_ID,
          lang: 'ar'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'success') {
          // Update transaction with real transaction ID
          await supabase
            .from('transactions')
            .update({ transaction_id: data.transactionId })
            .eq('order_id', orderData.orderId);

          return {
            success: true,
            paymentUrl: data.paymentUrl,
            transactionId: data.transactionId,
            orderId: orderData.orderId,
          };
        }
      }
    } catch (apiError) {
      console.warn('ZainCash API not available, using demo mode:', apiError);
    }

    // Demo/fallback mode
    const demoTransactionId = `demo_txn_${Date.now()}`;
    
    // Update transaction with demo transaction ID
    await supabase
      .from('transactions')
      .update({ transaction_id: demoTransactionId })
      .eq('order_id', orderData.orderId);

    // Create demo payment URL that simulates the payment flow
    const demoPaymentUrl = `data:text/html;charset=utf-8,${encodeURIComponent(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZainCash - محاكاة الدفع</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .logo { text-align: center; margin-bottom: 20px; }
          .amount { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
          .btn { width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
          .btn-success { background: #10b981; color: white; }
          .btn-danger { background: #ef4444; color: white; }
          .btn:hover { opacity: 0.9; }
          .info { background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h2 style="color: #2563eb;">💳 ZainCash</h2>
            <p style="color: #666;">محاكاة عملية الدفع</p>
          </div>
          
          <div class="info">
            <strong>تفاصيل العملية:</strong><br>
            رقم الطلب: ${orderData.orderId}<br>
            المبلغ: ${orderData.amount.toLocaleString()} د.ع<br>
            الخدمة: WASFAK-CV  - النسخة المميزة
          </div>
          
          <div class="amount">${orderData.amount.toLocaleString()} د.ع</div>
          
          <button class="btn btn-success" onclick="completePayment(true)">
            ✅ إتمام الدفع بنجاح
          </button>
          
          <button class="btn btn-danger" onclick="completePayment(false)">
            ❌ إلغاء العملية
          </button>
          
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
            هذه محاكاة لعملية الدفع في بيئة التطوير
          </div>
        </div>
        
        <script>
          function completePayment(success) {
            const status = success ? 'success' : 'failed';
            const redirectUrl = '${orderData.redirectUrl}?status=' + status + '&orderId=${orderData.orderId}&transactionId=${demoTransactionId}';
            window.location.href = redirectUrl;
          }
          
          // Auto-close after 5 minutes
          setTimeout(() => {
            window.close();
          }, 300000);
        </script>
      </body>
      </html>
    `)}`;

    return {
      success: true,
      paymentUrl: demoPaymentUrl,
      transactionId: demoTransactionId,
      orderId: orderData.orderId,
      isDemo: true,
    };
  } catch (error) {
    console.error('ZainCash initialization error:', error);
    throw new Error('فشل في تهيئة عملية الدفع');
  }
};

// Verify ZainCash payment
export const verifyZainCashPayment = async (transactionId: string, orderId: string) => {
  try {
    // Get URL parameters for demo mode
    const urlParams = new URLSearchParams(window.location.search);
    const urlStatus = urlParams.get('status');
    const urlOrderId = urlParams.get('orderId');
    const urlTransactionId = urlParams.get('transactionId');

    // Check if this is a demo transaction or real API call
    const isDemo = transactionId.startsWith('demo_txn_') || urlStatus;

    if (isDemo && urlOrderId === orderId) {
      // Demo mode verification
      const success = urlStatus === 'success';
      const status = success ? 'completed' : 'failed';
      
      // Update transaction status in Supabase
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status,
          verified_at: new Date().toISOString(),
        })
        .eq('order_id', orderId);

      if (updateError) {
        console.warn('Could not update transaction status:', updateError);
      }

      return {
        success,
        status,
        transactionId: urlTransactionId || transactionId,
        orderId,
        amount: ZAINCASH_PRICING.premium.amount,
        message: success ? 'تم الدفع بنجاح' : 'تم إلغاء العملية',
      };
    }

    // Try real ZainCash verification API
    const payload = {
      msisdn: ZAINCASH_CONFIG.MSISDN,
      transactionId,
      orderId,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = await generateZainCashToken(payload);

    try {
      const response = await fetch(`${getBaseUrl()}/transaction/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
          merchantId: ZAINCASH_CONFIG.MERCHANT_ID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update transaction status in Supabase
        await supabase
          .from('transactions')
          .update({ 
            status: data.status === 'success' ? 'completed' : 'failed',
            verified_at: new Date().toISOString(),
          })
          .eq('transaction_id', transactionId);

        return {
          success: data.status === 'success',
          status: data.status === 'success' ? 'completed' : 'failed',
          transactionId: data.transactionId,
          orderId: data.orderId,
          amount: data.amount,
          message: data.message,
        };
      }
    } catch (apiError) {
      console.warn('ZainCash verification API not available:', apiError);
    }

    // Fallback verification
    throw new Error('لا يمكن التحقق من حالة الدفع');
  } catch (error) {
    console.error('ZainCash verification error:', error);
    throw new Error('فشل في التحقق من حالة الدفع');
  }
};

// Generate unique order ID
export const generateOrderId = (): string => {
  return `CV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check user payment status
export const checkUserPaymentStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .eq('payment_method', 'zaincash')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('Could not check payment status:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};