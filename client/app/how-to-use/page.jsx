import AppClient from '../AppClient.jsx';
import SeoLandingContent from '../SeoLandingContent.jsx';
import { metadataForPage, seoPages } from '../seo.js';

export const metadata = metadataForPage(seoPages.howToUse);

export default function Page() {
  return (
    <>
      <AppClient initialPage="how-to-use" seoPage={seoPages.howToUse} />
      <SeoLandingContent page={seoPages.howToUse} />
    </>
  );
}
