"use client";
// DEPRECATED: Use pages/payment/result.tsx in Next.js migration
import React, { useEffect, useState } from 'react';
import { verifyZainCashPayment } from '../../lib/zaincash';

type PaymentVerificationResult = {
  success: boolean;
  status: string;
  transactionId: string;
  orderId: string;
  amount?: number;
  message?: string;
};

export const PaymentResult: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentVerificationResult | null>(null);
  // const navigate = useNavigate(); // Removed as per edit hint

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get order info from localStorage
        const orderInfo = localStorage.getItem('zaincash_order');
        if (!orderInfo) {
          setVerificationStatus('failed');
          return;
        }

        const order = JSON.parse(orderInfo);
        
        // Verify payment with ZainCash
        const result = await verifyZainCashPayment(order.transactionId, order.orderId);
        
        if (result.success) {
          setVerificationStatus('success');
          setPaymentDetails(result);
          
          // Mark payment as completed
          localStorage.setItem('zaincash_completed', 'true');
          localStorage.removeItem('zaincash_order');
          
          toast.success('تم التحقق من الدفع بنجاح!');
        } else {
          setVerificationStatus('failed');
          setPaymentDetails(result);
          toast.error(result.message || 'فشل في التحقق من الدفع');
        }
      } catch (error: unknown) {
        console.error('Payment verification error:', error);
        setVerificationStatus('failed');
        let message = 'حدث خطأ أثناء التحقق من الدفع';
        if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      }
    };

    // Simulate verification delay
    const timer = setTimeout(verifyPayment, 2000);
    return () => clearTimeout(timer);
  }, []);

  // const handleReturnHome = () => { // Removed as per edit hint
  //   navigate('/');
  // };

  // const handleRetryPayment = () => { // Removed as per edit hint
  //   localStorage.removeItem('zaincash_order');
  //   navigate('/');
  // };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">جاري التحقق من الدفع</h2>
          <p className="text-gray-600">يرجى الانتظار بينما نتحقق من حالة دفعتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {verificationStatus === 'success' ? (
          <>
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الدفع بنجاح!</h2>
            <p className="text-gray-600 mb-6">
              تهانينا! تم تفعيل النسخة المميزة من منشئ السيرة الذاتية
            </p>
            
            {paymentDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-right">
                <h3 className="font-semibold text-green-900 mb-2">تفاصيل العملية:</h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p>رقم العملية: {paymentDetails.transactionId}</p>
                  <p>رقم الطلب: {paymentDetails.orderId}</p>
                  <p>المبلغ: {paymentDetails.amount?.toLocaleString()} د.ع</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                // onClick={handleReturnHome} // Removed as per edit hint
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 space-x-reverse"
              >
                <HomeIcon className="h-5 w-5" />
                <span>العودة للصفحة الرئيسية</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">فشل في الدفع</h2>
            <p className="text-gray-600 mb-6">
              {paymentDetails?.message || 'حدث خطأ أثناء معالجة دفعتك. يرجى المحاولة مرة أخرى.'}
            </p>
            
            <div className="space-y-3">
              <button
                // onClick={handleRetryPayment} // Removed as per edit hint
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 space-x-reverse"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>إعادة المحاولة</span>
              </button>
              
              <button
                // onClick={handleReturnHome} // Removed as per edit hint
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center space-x-2 space-x-reverse"
              >
                <HomeIcon className="h-5 w-5" />
                <span>العودة للصفحة الرئيسية</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};