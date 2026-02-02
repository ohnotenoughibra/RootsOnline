import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Mail } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ | Roots Collective",
  description:
    "Frequently asked questions about Roots Collective - your online martial arts training platform.",
};

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        q: "What is Roots Collective?",
        a: "Roots Collective is a comprehensive online martial arts education platform offering high-quality courses in MMA, Kickboxing, Grappling/BJJ, and gym business management. We bring world-class instruction directly to you, whether you're training at home, supplementing your gym training, or looking to become a certified instructor.",
      },
      {
        q: "Who are the instructors?",
        a: "Our instructors are experienced martial artists, professional fighters, and successful gym owners. Each coach brings years of competition experience, coaching credentials, and a passion for teaching. You can view each instructor's profile and credentials on their course pages.",
      },
      {
        q: "Do I need prior martial arts experience?",
        a: "Not at all! We have courses for all skill levels, from complete beginners to advanced practitioners. Each course clearly indicates the recommended experience level, and our fundamentals courses are designed specifically for those just starting their martial arts journey.",
      },
      {
        q: "What equipment do I need to train at home?",
        a: "For most technique study and drilling, you only need comfortable workout clothes and enough floor space to move. For grappling courses, a training partner and mats are recommended. Striking courses may require a heavy bag or pads. Each course lists specific equipment recommendations in the description.",
      },
    ],
  },
  {
    title: "Subscription & Pricing",
    questions: [
      {
        q: "How much does a subscription cost?",
        a: "We offer flexible subscription plans to fit your needs. Our monthly subscription gives you unlimited access to our entire course library. We also offer discounted annual plans for committed learners. Visit our pricing page for current rates.",
      },
      {
        q: "Can I purchase individual courses instead of subscribing?",
        a: "Yes! Many courses are available for one-time purchase, giving you permanent access to that specific course. This is great if you're interested in a particular topic or instructor. Courses with individual pricing show the price on their detail page.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes, we offer free preview lessons on most courses so you can experience our teaching style before committing. Additionally, new members can explore our platform with a trial period. Check our current offers on the pricing page.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period. There are no cancellation fees or long-term commitments.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a satisfaction guarantee for new subscribers. If you're not happy with your subscription within the first 14 days, contact our support team for a full refund. Individual course purchases are generally non-refundable, but we handle each case individually.",
      },
    ],
  },
  {
    title: "Courses & Content",
    questions: [
      {
        q: "What disciplines do you cover?",
        a: "We offer comprehensive courses in MMA (Mixed Martial Arts), Kickboxing/Muay Thai, Grappling/BJJ (Brazilian Jiu-Jitsu), and Wrestling. We also have a Business Academy section for gym owners and aspiring instructors covering gym operations, marketing, events, and more.",
      },
      {
        q: "How are courses structured?",
        a: "Each course is organized into modules containing individual lessons. Lessons include high-quality video instruction, detailed technique breakdowns, and often supplementary materials. You can track your progress, take notes, and resume where you left off.",
      },
      {
        q: "Can I download videos for offline viewing?",
        a: "Currently, our content is available for streaming only. This allows us to continuously update and improve our courses. We recommend using our mobile-optimized website for training on the go.",
      },
      {
        q: "How often is new content added?",
        a: "We add new courses and lessons regularly. Our coaches are constantly developing new material based on member feedback and the latest developments in martial arts. Subscribers get access to all new content as it's released.",
      },
      {
        q: "Are there live sessions or Q&A opportunities?",
        a: "Yes! We host live Q&A sessions with coaches, and our Business Academy includes a community Q&A forum where you can ask questions and get answers from experienced practitioners and gym owners.",
      },
    ],
  },
  {
    title: "Certifications & Credentials",
    questions: [
      {
        q: "Do you offer instructor certifications?",
        a: "Yes! Our Instructor Certification Program allows dedicated students to earn recognized credentials. Certifications are available at multiple levels and require completing specific courses, demonstrating technique proficiency via video submission, and passing assessments.",
      },
      {
        q: "Are your certifications recognized?",
        a: "Our certifications are recognized by partner gyms and academies. While martial arts certifications vary in recognition, our rigorous standards and practical requirements ensure our certified instructors are well-prepared to teach.",
      },
      {
        q: "How long does certification take?",
        a: "Certification timeline varies based on your current skill level and availability. Most students complete Level 1 certification within 3-6 months of focused study. You progress at your own pace while meeting the required benchmarks.",
      },
      {
        q: "Do certifications expire?",
        a: "Yes, certifications are valid for 24 months and require renewal through continuing education. This ensures our certified instructors stay current with evolving techniques and teaching methods.",
      },
    ],
  },
  {
    title: "Technical & Account",
    questions: [
      {
        q: "What devices can I use to access courses?",
        a: "Roots Collective works on any device with a modern web browser - computers, tablets, and smartphones. Our responsive design ensures a great experience whether you're watching on a big screen or reviewing techniques on your phone at the gym.",
      },
      {
        q: "How do I track my progress?",
        a: "Your progress is automatically saved as you watch lessons. You can see completion percentages for each course and module, resume videos where you left off, and view your overall learning stats in your dashboard.",
      },
      {
        q: "Can I share my account with others?",
        a: "Each account is for individual use. Sharing accounts violates our terms of service and can result in account suspension. If you're a gym owner wanting access for multiple instructors, contact us about our gym partnership programs.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click the 'Forgot Password' link on the sign-in page and enter your email. You'll receive instructions to reset your password. If you don't receive the email, check your spam folder or contact support.",
      },
      {
        q: "How do I update my payment information?",
        a: "Go to your account settings and select 'Billing' to update your payment method. Changes take effect for your next billing cycle.",
      },
    ],
  },
  {
    title: "Business Academy",
    questions: [
      {
        q: "What is the Business Academy?",
        a: "The Business Academy is our dedicated section for gym owners, aspiring gym owners, and martial arts professionals. It includes courses on gym operations, marketing, running events, building community, staffing, legal considerations, and scaling your business.",
      },
      {
        q: "Is Business Academy content included in my subscription?",
        a: "Yes! Business Academy courses are included in your subscription along with all training content. Some premium resources and templates may be available for additional purchase.",
      },
      {
        q: "I want to open a gym. Where should I start?",
        a: "Start with our 'Gym Operations' courses for foundational knowledge, then explore 'Finance & Pricing' and 'Legal & Insurance' sections. Our Q&A forum is also invaluable - search for questions from others in similar situations or ask your own.",
      },
      {
        q: "Can I get personalized business coaching?",
        a: "While our courses provide comprehensive education, we also connect members with experienced gym owners for mentorship. Check our coaching and consultation offerings or reach out to discuss your specific needs.",
      },
    ],
  },
  {
    title: "Community & Support",
    questions: [
      {
        q: "Is there a community forum or discussion area?",
        a: "Yes! Our Business Academy includes a Q&A forum where members can ask questions and share experiences. We're expanding community features across the platform to help martial artists connect and learn from each other.",
      },
      {
        q: "How do I contact customer support?",
        a: "You can reach our support team via email at support@rootscollective.com. We typically respond within 24-48 hours. For urgent account issues, include 'URGENT' in your subject line.",
      },
      {
        q: "I have feedback or a course suggestion. How do I share it?",
        a: "We love hearing from our members! Use the feedback form in your account settings, email us directly, or post in our community forums. Many of our courses and features have been developed based on member suggestions.",
      },
      {
        q: "Do you have an affiliate or referral program?",
        a: "Yes! Our referral program rewards you for introducing new members to Roots Collective. Share your unique referral link and earn credits toward your subscription. Details are available in your account settings.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about Roots Collective, our courses,
            subscriptions, and more.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${categoryIndex}-${index}`}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <Card className="mt-12">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="mailto:support@rootscollective.com">
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link href="/business/qa">
                <Button variant="outline">
                  Browse Community Q&A
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
