'use client';

import App from '../src/App.jsx';
import { structuredDataForPage } from './seo.js';

export default function AppClient({ initialPage = 'home', seoPage }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataForPage(seoPage)) }}
      />
      <App initialPage={initialPage} />
    </>
  );
}
