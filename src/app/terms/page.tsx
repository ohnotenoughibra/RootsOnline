export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using ROA (Roots Online Academy), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            ROA provides online martial arts instruction through video courses, including but not
            limited to MMA, Kickboxing, and Grappling content. Our service includes access to
            instructional videos, training footage feedback, and community features.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activities that occur under your account. You must provide accurate and
            complete information when creating an account.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Subscription and Payments</h2>
          <p>
            Paid subscriptions are billed in advance on a recurring basis (monthly or annually).
            You can cancel your subscription at any time, and you will continue to have access
            until the end of your current billing period.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>All payments are processed securely through Stripe</li>
            <li>Prices are subject to change with 30 days notice</li>
            <li>Refunds are available within 30 days of purchase</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Content Usage</h2>
          <p>
            All content on ROA is protected by copyright and other intellectual property laws.
            You may not copy, distribute, modify, or create derivative works from our content
            without explicit permission.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Share your account credentials with others</li>
            <li>Download or redistribute course content</li>
            <li>Use the service for any illegal purpose</li>
            <li>Harass or harm other users or coaches</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Disclaimer</h2>
          <p>
            Martial arts training involves inherent risks. ROA is not responsible for any injuries
            that may occur from practicing techniques shown in our videos. Always train safely
            and consult with a medical professional before beginning any physical training program.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p>
            ROA shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages resulting from your use of or inability to use the service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of
            significant changes via email or through the service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us at support@roa.com
          </p>
        </div>
      </div>
    </div>
  );
}
