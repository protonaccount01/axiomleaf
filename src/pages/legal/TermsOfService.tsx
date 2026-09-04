import { Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { SITE } from "@/config/site";

export default function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      description={`The terms and conditions governing your use of ${SITE.name}, its free online tools and blog content.`}
      path="/terms-of-service"
      updated="1 January 2025"
    >
      <p>
        Welcome to {SITE.name}. By accessing or using {SITE.url} (the "Site") you agree to be bound by these Terms of
        Service. If you do not agree, please do not use the Site.
      </p>

      <h2>1. Use of the Site</h2>
      <p>
        The Site provides free, browser-based utilities and editorial content for personal and commercial use. You may
        use the output of any tool (for example generated passwords, formatted JSON, QR codes) in your own projects
        without attribution.
      </p>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site in any way that violates applicable law or regulation;</li>
        <li>Attempt to interfere with the proper working of the Site, including through automated abuse, scraping at excessive rates or denial-of-service activity;</li>
        <li>Reproduce, redistribute or resell the Site's original written content or design without permission;</li>
        <li>Circumvent, disable or interfere with security features of the Site.</li>
      </ul>

      <h2>2. No warranty</h2>
      <p>
        The tools and content are provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties
        of any kind, whether express or implied, including but not limited to warranties of accuracy, merchantability,
        fitness for a particular purpose or non-infringement. We work hard to make the tools correct, but you are
        responsible for verifying results before relying on them – especially for financial, medical or legal decisions.
      </p>

      <h2>3. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE.name} and its operators shall not be liable for any indirect,
        incidental, special, consequential or punitive damages, or any loss of data, profits or revenue, arising out of
        or in connection with your use of the Site.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        The {SITE.name} name, logo, site design and original articles are the property of {SITE.name}. Open-source
        libraries used by the Site remain under their respective licences. You retain all rights to any content you
        enter into the tools – which, as noted in our Privacy Policy, never leaves your device.
      </p>

      <h2>5. Third-party links and advertising</h2>
      <p>
        The Site may contain links to third-party websites and may display advertisements served by third parties. We
        do not control and are not responsible for the content, privacy practices or availability of those sites and
        services. Your dealings with advertisers are solely between you and the advertiser.
      </p>

      <h2>6. Blog content</h2>
      <p>
        Articles reflect the opinions of their authors at the time of writing and are provided for informational
        purposes only. They do not constitute professional advice.
      </p>

      <h2>7. Changes to the Site and Terms</h2>
      <p>
        We may modify, suspend or discontinue any part of the Site at any time without notice. We may also revise these
        Terms; the updated version becomes effective when posted. Your continued use of the Site constitutes acceptance
        of the revised Terms.
      </p>

      <h2>8. Governing law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which the Site operator resides, without regard to
        conflict-of-law principles. Any dispute shall be resolved in the competent courts of that jurisdiction.
      </p>

      <h2>9. Contact</h2>
      <p>
        For questions about these Terms, please use the <Link to="/contact">Contact page</Link> or email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalLayout>
  );
}
