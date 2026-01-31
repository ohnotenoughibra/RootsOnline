export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Account information (name, email address)</li>
            <li>Payment information (processed securely by Stripe)</li>
            <li>Training footage you upload for feedback</li>
            <li>Course progress and viewing history</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Track your progress through courses</li>
            <li>Provide personalized feedback on training footage</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties.
            We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>With your consent</li>
            <li>With coaches for providing feedback on your training footage</li>
            <li>With service providers who assist in our operations (e.g., Stripe for payments)</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>All data is encrypted in transit using SSL/TLS</li>
            <li>Payment information is handled by PCI-compliant Stripe</li>
            <li>Access to personal data is restricted to authorized personnel</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service
            and hold certain information. You can instruct your browser to refuse all cookies
            or indicate when a cookie is being sent.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Third-Party Services</h2>
          <p>Our service uses the following third-party services:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Clerk</strong> - Authentication and user management</li>
            <li><strong>Stripe</strong> - Payment processing</li>
            <li><strong>Cloudinary</strong> - Video hosting and delivery</li>
            <li><strong>Vercel</strong> - Application hosting</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under 13 years of age. We do not knowingly
            collect personal information from children under 13.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any
            changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at
            privacy@roa.com
          </p>
        </div>
      </div>
    </div>
  );
}
