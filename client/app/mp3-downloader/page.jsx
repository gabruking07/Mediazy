import AppClient from '../AppClient.jsx';
import SeoLandingContent from '../SeoLandingContent.jsx';
import { metadataForPage, seoPages } from '../seo.js';

export const metadata = metadataForPage(seoPages.mp3);

export default function Page() {
  return (
    <>
      <AppClient seoPage={seoPages.mp3} />
      <SeoLandingContent page={seoPages.mp3} />
    </>
  );
}
