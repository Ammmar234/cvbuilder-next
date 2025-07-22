import './login.css';
import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const EyeIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => mod.EyeIcon));
const EyeSlashIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => mod.EyeSlashIcon));
let toast: typeof import('react-hot-toast').toast;
if (typeof window !== 'undefined') {
  import('react-hot-toast').then(mod => { toast = mod.toast; });
}

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast && toast.success('تم تسجيل الدخول بنجاح');
        router.push('/');
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) throw error;
        toast && toast.success('تم إنشاء الحساب بنجاح');
        router.push('/');
      }
    } catch (error: unknown) {
      function isErrorWithMessage(err: unknown): err is { message: string } {
        return (
          typeof err === 'object' &&
          err !== null &&
          'message' in err &&
          typeof (err as { message: unknown }).message === 'string'
        );
      }
      const message = isErrorWithMessage(error) ? error.message : 'حدث خطأ ما';
      toast && toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [isLogin, signIn, signUp, formData, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  return (
    <div className="login-bg">
      <div className="login-card-container">
        <div className="login-card">
          <div>
            <h2 className="login-title">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h2>
            <p className="login-subtitle">
              {isLogin ? 'قم بتسجيل الدخول لإنشاء سيرتك الذاتية' : 'انضم إلينا لإنشاء سيرة ذاتية احترافية'}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-fields">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="login-label">
                    الاسم الكامل
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="login-label">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <div>
                <label htmlFor="password" className="login-label">
                  كلمة المرور
                </label>
                <div className="login-password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={useCallback(() => setShowPassword(prev => !prev), [])}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="login-password-icon" />
                    ) : (
                      <EyeIcon className="login-password-icon" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? 'جاري التحميل...' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </button>
            </div>

            <div className="login-toggle-container">
              <button
                type="button"
                onClick={useCallback(() => setIsLogin(prev => !prev), [])}
                className="login-toggle-btn"
              >
                {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب؟ تسجيل الدخول'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthForm);