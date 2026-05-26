import '../src/styles.css';
import Providers from './providers.jsx';

export const metadata = {
  title: 'Mediazy',
  description: 'All-in-one media downloader'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Providers />
      </body>
    </html>
  );
}
