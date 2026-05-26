import AppClient from '../AppClient.jsx';
import SeoLandingContent from '../SeoLandingContent.jsx';
import { metadataForPage, seoPages } from '../seo.js';

export const metadata = metadataForPage(seoPages.contact);

export default function Page() {
  return (
    <>
      <AppClient initialPage="contact" seoPage={seoPages.contact} />
      <SeoLandingContent page={seoPages.contact} />
    </>
  );
}
