import AppClient from '../AppClient.jsx';
import SeoLandingContent from '../SeoLandingContent.jsx';
import { metadataForPage, seoPages } from '../seo.js';

export const metadata = metadataForPage(seoPages.facebook);

export default function Page() {
  return (
    <>
      <AppClient seoPage={seoPages.facebook} />
      <SeoLandingContent page={seoPages.facebook} />
    </>
  );
}
