"use client";

import React, { memo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export const Header: React.FC = memo(() => {
  const { user, loading, signOut, signIn } = useAuth();
  console.log('Header user:', user);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-md font-bold text-gray-900 md:text-2xl">
              WASFAK
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-gray-500 text-sm">جاري التحميل...</span>
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <UserCircleIcon className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="text-sm">تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
