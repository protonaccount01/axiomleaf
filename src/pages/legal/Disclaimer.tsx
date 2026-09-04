import { Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { SITE } from "@/config/site";

export default function Disclaimer() {
  return (
    <LegalLayout
      title="Disclaimer"
      description={`Important disclaimers about the accuracy of ${SITE.name} tools, calculators and articles, and about advertising and external links.`}
      path="/disclaimer"
      updated="1 January 2025"
    >
      <h2>General information</h2>
      <p>
        All information and tools on {SITE.name} are published in good faith and for general informational purposes
        only. We make no warranties about the completeness, reliability or accuracy of this information or the output
        of any tool. Any action you take based on the Site is strictly at your own risk.
      </p>

      <h2>Calculators are estimates</h2>
      <p>
        Financial calculators (such as the Loan/EMI, Discount and Tip calculators) use standard formulas and do not
        account for fees, taxes, compounding conventions or regional regulations that a lender or retailer may apply.
        Always confirm figures with the relevant institution.
      </p>
      <p>
        Health-related calculators (such as the BMI calculator) are screening tools, not medical devices. They do not
        diagnose any condition. Consult a qualified healthcare professional for medical advice.
      </p>

      <h2>Security tools</h2>
      <p>
        The Password Generator and Hash Generator use your browser's cryptographic APIs. While these are considered
        secure, we cannot guarantee the security of your device, browser extensions or network. Use a reputable password
        manager to store generated credentials.
      </p>

      <h2>External links</h2>
      <p>
        The Site may link to external websites that are not provided or maintained by us. We do not guarantee the
        accuracy, relevance or completeness of any information on those sites.
      </p>

      <h2>Advertising</h2>
      <p>
        Advertisements displayed on the Site are provided by third-party networks. The appearance of an advertisement
        does not constitute an endorsement by {SITE.name}.
      </p>

      <h2>Consent</h2>
      <p>
        By using the Site you consent to this Disclaimer and agree to its terms. Please also read our{" "}
        <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>.
      </p>
    </LegalLayout>
  );
}
