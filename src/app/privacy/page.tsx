export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
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
              <h2 className="text-lg font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information you provide directly to us, including:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Account information (name, email address)
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Payment information (processed securely by Stripe)
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Training footage you upload for feedback
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Course progress and viewing history
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Provide, maintain, and improve our services
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Process transactions and send related information
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Send you technical notices and support messages
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Track your progress through courses
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties.
                We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  With your consent
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  With coaches for providing feedback on your training footage
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  With service providers who assist in our operations
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To comply with legal obligations
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  All data is encrypted in transit using SSL/TLS
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Payment information is handled by PCI-compliant Stripe
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Access to personal data is restricted to authorized personnel
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Access your personal data
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Correct inaccurate data
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Request deletion of your data
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Export your data
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Opt out of marketing communications
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our service
                and hold certain information. You can instruct your browser to refuse all cookies
                or indicate when a cookie is being sent.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">7. Third-Party Services</h2>
              <p className="text-muted-foreground mb-4">Our service uses the following third-party services:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Clerk</strong> - Authentication and user management</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Stripe</strong> - Payment processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Cloudinary</strong> - Video hosting and delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Vercel</strong> - Application hosting</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">8. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                Our service is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@rootsonline.com" className="underline underline-offset-4 hover:text-foreground">
                  privacy@rootsonline.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
