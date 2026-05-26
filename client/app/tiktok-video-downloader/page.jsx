import AppClient from '../AppClient.jsx';
import SeoLandingContent from '../SeoLandingContent.jsx';
import { metadataForPage, seoPages } from '../seo.js';

export const metadata = metadataForPage(seoPages.tiktok);

export default function Page() {
  return (
    <>
      <AppClient seoPage={seoPages.tiktok} />
      <SeoLandingContent page={seoPages.tiktok} />
    </>
  );
}
