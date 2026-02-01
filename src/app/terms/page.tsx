export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="text-lg font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using ROA (Roots Online Academy), you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                ROA provides online martial arts instruction through video courses, including but not
                limited to MMA, Kickboxing, and Grappling content. Our service includes access to
                instructional videos, training footage feedback, and community features.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account. You must provide accurate and
                complete information when creating an account.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">4. Subscription and Payments</h2>
              <p className="text-muted-foreground mb-4">
                Paid subscriptions are billed in advance on a recurring basis (monthly or annually).
                You can cancel your subscription at any time, and you will continue to have access
                until the end of your current billing period.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  All payments are processed securely through Stripe
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Prices are subject to change with 30 days notice
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Refunds are available within 30 days of purchase
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">5. Content Usage</h2>
              <p className="text-muted-foreground">
                All content on ROA is protected by copyright and other intellectual property laws.
                You may not copy, distribute, modify, or create derivative works from our content
                without explicit permission.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">6. User Conduct</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Share your account credentials with others
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Download or redistribute course content
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Use the service for any illegal purpose
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Harass or harm other users or coaches
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">7. Disclaimer</h2>
              <p className="text-muted-foreground">
                Martial arts training involves inherent risks. ROA is not responsible for any injuries
                that may occur from practicing techniques shown in our videos. Always train safely
                and consult with a medical professional before beginning any physical training program.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                ROA shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of or inability to use the service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of
                significant changes via email or through the service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">10. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:support@rootsonline.com" className="underline underline-offset-4 hover:text-foreground">
                  support@rootsonline.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
