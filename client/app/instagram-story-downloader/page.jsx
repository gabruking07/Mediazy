import AppClient from '../AppClient.jsx';
import SeoLandingContent from '../SeoLandingContent.jsx';
import { metadataForPage, seoPages } from '../seo.js';

export const metadata = metadataForPage(seoPages.stories);

export default function Page() {
  return (
    <>
      <AppClient initialPage="stories" seoPage={seoPages.stories} />
      <SeoLandingContent page={seoPages.stories} />
    </>
  );
}
