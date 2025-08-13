import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: August 12, 2025</p>
      
      <section className="mt-8">
        <h2>1. Information We Collect</h2>
        <p>
          We collect several types of information from and about users of our Platform, including:
        </p>
        <ul>
          <li>Personal identification information (name, email address, phone number, etc.)</li>
          <li>Health and medical information you choose to provide</li>
          <li>Usage details, IP addresses, and information collected through cookies and other tracking technologies</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2>2. How We Use Your Information</h2>
        <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
        <ul>
          <li>To present our Platform and its contents to you</li>
          <li>To provide you with information, products, or services that you request from us</li>
          <li>To fulfill any other purpose for which you provide it</li>
          <li>To notify you about changes to our Platform or any products or services we offer</li>
          <li>To improve our Platform, products, and services</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2>3. Data Security</h2>
        <p>
          We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. 
          All information you provide to us is stored on secure servers behind firewalls.
        </p>
        <p className="mt-4">
          The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Platform, 
          you are responsible for keeping this password confidential.
        </p>
      </section>

      <section className="mt-8">
        <h2>4. Your Data Protection Rights</h2>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul>
          <li>The right to access, update, or delete your information</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
          <li>The right to complain to a data protection authority</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2>5. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </section>

      <section className="mt-8">
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <address className="not-italic mt-2">
          Health Bridge Privacy Officer<br />
          privacy@healthbridge.com<br />
          +1 (555) 123-4567
        </address>
      </section>
    </article>
  );
}
