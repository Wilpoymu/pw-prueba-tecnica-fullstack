import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
