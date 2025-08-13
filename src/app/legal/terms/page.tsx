import Link from 'next/link';

export default function TermsPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Terms & Conditions</h1>
      <p className="text-muted-foreground">Last updated: August 12, 2025</p>
      
      <section className="mt-8">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Health Bridge. These Terms of Service ("Terms") govern your access to and use of the Health Bridge platform, 
          including any content, functionality, and services offered on or through healthbridge.com (the "Platform").
        </p>
      </section>

      <section className="mt-8">
        <h2>2. Your Account</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
          You agree to immediately notify us of any unauthorized use of your account.
        </p>
      </section>

      <section className="mt-8">
        <h2>3. Use of Services</h2>
        <p>
          You agree to use the Services only for lawful purposes and in accordance with these Terms. You agree not to use the Services:
        </p>
        <ul>
          <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
          <li>To transmit any advertising or promotional material without our prior written consent</li>
          <li>To impersonate or attempt to impersonate Health Bridge, a Health Bridge employee, another user, or any other person or entity</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2>4. Health Information</h2>
        <p>
          The Platform allows you to store and manage health information. By using these features, you understand and agree that:
        </p>
        <ul>
          <li>You are responsible for the accuracy of the information you provide</li>
          <li>We may use de-identified data for research and improvement of our services</li>
          <li>You should always consult with a qualified healthcare provider for medical advice</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2>5. Changes to Terms</h2>
        <p>
          We may revise and update these Terms from time to time at our sole discretion. All changes are effective immediately when we post them.
          Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes.
        </p>
      </section>

      <section className="mt-8">
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <address className="not-italic mt-2">
          Health Bridge Support<br />
          support@healthbridge.com<br />
          +1 (555) 123-4567
        </address>
      </section>
    </article>
  );
}
