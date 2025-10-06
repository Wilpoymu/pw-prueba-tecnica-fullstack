import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
    <div className={`${poppins.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  </ThemeProvider>
);

export default App;
