import { Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { SITE } from "@/config/site";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description={`How ${SITE.name} handles your data: what we collect (very little), cookies, advertising, third-party services and your rights.`}
      path="/privacy-policy"
      updated="1 January 2025"
    >
      <p>
        {SITE.name} ("we", "us", "our") operates {SITE.url}. This Privacy Policy explains what information we collect,
        how we use it, and the choices you have. We have written it in plain language because we believe privacy
        policies should be readable by the people they affect.
      </p>

      <h2>1. The short version</h2>
      <ul>
        <li>Our tools process your input <strong>in your browser only</strong>. We never receive it.</li>
        <li>We do not require accounts and do not collect names, emails or passwords through the site.</li>
        <li>Our hosting provider and advertising partners may collect standard technical data (IP address, browser type) as described below.</li>
        <li>You can use the site with ads personalisation disabled and with cookies blocked.</li>
      </ul>

      <h2>2. Information we do not collect</h2>
      <p>
        Text you type into the Word Counter, JSON you paste into the formatter, images you convert to Base64, passwords
        you generate and everything else you enter into a tool stays on your device. These tools are implemented in
        client-side JavaScript and make no network requests with your data. The Online Notepad stores your note in your
        own browser's local storage, which we cannot access.
      </p>

      <h2>3. Information collected automatically</h2>
      <p>When you visit any website, certain technical information is transmitted by your browser. In our case:</p>
      <ul>
        <li>
          <strong>Hosting &amp; CDN.</strong> The site is served through Cloudflare (and/or GitHub Pages). These providers
          may log IP addresses, request URLs, timestamps and user-agent strings for security and performance purposes.
          See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare's privacy policy</a>.
        </li>
        <li>
          <strong>Analytics.</strong> If we enable privacy-respecting analytics (for example Cloudflare Web Analytics), it
          collects aggregated page-view counts without cookies or cross-site tracking.
        </li>
      </ul>

      <h2>4. Advertising and cookies</h2>
      <p>
        We may display advertisements served by Google AdSense to keep the site free. Google and its partners use
        cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this and other websites.
      </p>
      <ul>
        <li>
          You can opt out of personalised advertising at{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
        </li>
        <li>
          Learn how Google uses data from partner sites at{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.
        </li>
        <li>
          Third-party vendors' use of cookies is subject to their own privacy policies. You can opt out of many of them at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
        </li>
      </ul>
      <p>
        Visitors in the European Economic Area and United Kingdom will be shown a consent message before personalised
        ads are served, in line with GDPR and the ePrivacy Directive.
      </p>

      <h2>5. Blog content</h2>
      <p>
        Blog articles are fetched from Google's Blogger platform via its public API. Images inside articles may be
        loaded from Google's content servers. No information about you is sent to Blogger other than the standard
        request for the public post data.
      </p>

      <h2>6. Contact form and email</h2>
      <p>
        If you contact us by email, we will keep your message and address for as long as necessary to respond and
        maintain a record of correspondence. We do not add you to marketing lists.
      </p>

      <h2>7. Children's privacy</h2>
      <p>
        The site is not directed at children under 13 (or 16 where applicable) and we do not knowingly collect personal
        information from them.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete or restrict the processing of
        personal data. Because we hold essentially no personal data, these requests will usually concern our providers;
        we will help you direct them appropriately. Contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>9. Security</h2>
      <p>
        The site is served exclusively over HTTPS, protected by Cloudflare's network, and ships with a strict Content
        Security Policy and other security headers. Because we do not store user data, there is no user database to
        compromise.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "last updated" date at the top reflects the latest revision.
        Continued use of the site after changes constitutes acceptance of the revised policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions? Visit the <Link to="/contact">Contact page</Link> or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalLayout>
  );
}
