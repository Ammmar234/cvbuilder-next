import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { verifyZainCashPayment } from '../../lib/zaincash';

const CheckCircleIcon = dynamic(() => import('@heroicons/react/24/outline').then(m => m.CheckCircleIcon), { ssr: false });
const XCircleIcon = dynamic(() => import('@heroicons/react/24/outline').then(m => m.XCircleIcon), { ssr: false });
const ArrowPathIcon = dynamic(() => import('@heroicons/react/24/outline').then(m => m.ArrowPathIcon), { ssr: false });
const HomeIcon = dynamic(() => import('@heroicons/react/24/outline').then(m => m.HomeIcon), { ssr: false });

export default function PaymentResult() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderInfo = localStorage.getItem('zaincash_order');
        if (!orderInfo) {
          setVerificationStatus('failed');
          return;
        }
        const order = JSON.parse(orderInfo);
        const result = await verifyZainCashPayment(order.transactionId, order.orderId);
        if (result.success) {
          setVerificationStatus('success');
          setPaymentDetails(result);
          localStorage.setItem('zaincash_completed', 'true');
          localStorage.removeItem('zaincash_order');
          toast.success('تم التحقق من الدفع بنجاح!');
        } else {
          setVerificationStatus('failed');
          setPaymentDetails(result);
          toast.error(result.message || 'فشل في التحقق من الدفع');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setVerificationStatus('failed');
        toast.error('حدث خطأ أثناء التحقق من الدفع');
      }
    };
    const timer = setTimeout(verifyPayment, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleReturnHome = () => {
    router.push('/');
  };

  const handleRetryPayment = () => {
    localStorage.removeItem('zaincash_order');
    router.push('/');
  };

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
                onClick={handleReturnHome}
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
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 space-x-reverse"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>إعادة المحاولة</span>
              </button>
              <button
                onClick={handleReturnHome}
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
} 