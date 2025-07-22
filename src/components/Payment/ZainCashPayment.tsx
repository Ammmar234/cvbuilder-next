"use client";

import React, { useState, useCallback, memo } from 'react';
import { toast } from 'react-hot-toast';
import { CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { 
  initializeZainCashPayment, 
  ZAINCASH_PRICING, 
  generateOrderId,
  checkUserPaymentStatus
} from '../../lib/zaincash';

interface ZainCashPaymentProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Loading component for payment
const PaymentLoading = memo(() => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="mr-3 text-gray-600">جاري تحميل بوابة الدفع...</span>
  </div>
));

export const ZainCashPayment: React.FC<ZainCashPaymentProps> = memo(({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '5000',
    currency: 'IQD',
    description: 'ترقية إلى النسخة المميزة - منشئ السيرة الذاتية'
  });

  const handlePayment = useCallback(async () => {
    setIsLoading(true);
    try {
      // Dynamic import for payment processing to reduce initial bundle
      const { processZainCashPayment } = await import('../../lib/zaincash');
      
      const result = await processZainCashPayment({
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description
      });

      if (result.success) {
        onSuccess();
        toast.success('تم الدفع بنجاح!');
      } else {
        onError(result.error || 'فشل في عملية الدفع');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError('حدث خطأ أثناء معالجة الدفع');
    } finally {
      setIsLoading(false);
    }
  }, [paymentData, onSuccess, onError]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  if (isLoading) {
    return <PaymentLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">معلومات الدفع</h3>
        <p className="text-blue-700 text-sm">
          ستحصل على جميع الميزات المميزة بما في ذلك القوالب الاحترافية والتصدير غير المحدود.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المبلغ (دينار عراقي)
          </label>
          <input
            type="text"
            value={paymentData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            value={paymentData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="وصف الدفع"
          />
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'جاري المعالجة...' : 'إتمام الدفع'}
      </button>

      <div className="text-xs text-gray-500 text-center">
        سيتم توجيهك إلى بوابة الدفع الآمنة من ZainCash
      </div>
    </div>
  );
});