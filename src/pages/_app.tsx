import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { PersonalInfoProvider } from '../contexts/PersonalInfoContext';
import { EducationProvider } from '../contexts/EducationContext';
import { ExperienceProvider } from '../contexts/ExperienceContext';
import { SkillsProvider } from '../contexts/SkillsContext';
import { LanguagesProvider } from '../contexts/LanguagesContext';
import { Toaster } from 'react-hot-toast';
import '../app/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PersonalInfoProvider>
        <EducationProvider>
          <ExperienceProvider>
            <SkillsProvider>
              <LanguagesProvider>
                <div className="App" dir="rtl">
                  <Component {...pageProps} />
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                    }}
                  />
                </div>
              </LanguagesProvider>
            </SkillsProvider>
          </ExperienceProvider>
        </EducationProvider>
      </PersonalInfoProvider>
    </AuthProvider>
  );
} 