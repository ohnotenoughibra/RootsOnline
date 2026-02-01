import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export function isEmailConfigured(): boolean {
  return !!resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "ROA <noreply@rootsonline.academy>";

export type EmailTemplate =
  | "welcome"
  | "subscription-confirmed"
  | "subscription-cancelled"
  | "payment-failed"
  | "payment-retry"
  | "trial-ending"
  | "course-completed"
  | "certificate-earned"
  | "weekly-digest";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  if (!resend) {
    console.log("[Email] Resend not configured, skipping email:", options.subject);
    return { success: false, error: "Email not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error("[Email] Failed to send:", error);
      return { success: false, error: error.message };
    }

    console.log("[Email] Sent successfully:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Email] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// Email template generator
function generateEmailWrapper(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roots Online Academy</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
      color: #18181b;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      color: #a1a1aa;
      margin: 8px 0 0;
      font-size: 14px;
    }
    .content {
      padding: 32px;
    }
    .content h2 {
      color: #18181b;
      font-size: 20px;
      margin: 0 0 16px;
    }
    .content p {
      color: #52525b;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .button {
      display: inline-block;
      background-color: #dc2626;
      color: #ffffff !important;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
    }
    .button:hover {
      background-color: #b91c1c;
    }
    .info-box {
      background-color: #f4f4f5;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .info-box h3 {
      margin: 0 0 12px;
      font-size: 16px;
      color: #18181b;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
    }
    .warning-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 24px 0;
    }
    .warning-box p {
      color: #92400e;
      margin: 0;
    }
    .footer {
      background-color: #f4f4f5;
      padding: 24px 32px;
      text-align: center;
    }
    .footer p {
      color: #71717a;
      font-size: 12px;
      margin: 0 0 8px;
    }
    .footer a {
      color: #dc2626;
      text-decoration: none;
    }
    .social-links {
      margin: 16px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #71717a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ROA</h1>
      <p>Roots Online Academy</p>
    </div>
    ${content}
    <div class="footer">
      <p>Questions? Reply to this email or contact support@rootsonline.academy</p>
      <p>&copy; ${new Date().getFullYear()} Roots Online Academy. All rights reserved.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy"}/dashboard/settings">Email Preferences</a> |
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy"}/terms">Terms</a> |
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy"}/privacy">Privacy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Template functions
export function welcomeEmail(data: { firstName: string }): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";

  return {
    subject: "Welcome to Roots Online Academy!",
    html: generateEmailWrapper(`
      <div class="content">
        <h2>Welcome, ${data.firstName}!</h2>
        <p>We're thrilled to have you join the Roots Online Academy community. You're about to embark on an incredible martial arts journey with world-class instruction.</p>

        <div class="info-box">
          <h3>What's next?</h3>
          <p>Explore our courses in MMA, Kickboxing, and Grappling. Start with any course that interests you - all content is available with your subscription.</p>
        </div>

        <a href="${appUrl}/courses" class="button">Browse Courses</a>

        <p>If you have any questions, our team is here to help. Just reply to this email!</p>

        <p>Train hard,<br>The ROA Team</p>
      </div>
    `, "Your martial arts journey begins now"),
  };
}

export function subscriptionConfirmedEmail(data: {
  firstName: string;
  plan: string;
  amount: string;
  nextBillingDate?: string;
}): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";

  return {
    subject: "Your ROA Subscription is Active!",
    html: generateEmailWrapper(`
      <div class="content">
        <h2>You're all set, ${data.firstName}!</h2>
        <p>Your subscription to Roots Online Academy has been confirmed. You now have full access to all our premium content.</p>

        <div class="info-box">
          <h3>Subscription Details</h3>
          <p><strong>Plan:</strong> ${data.plan}</p>
          <p><strong>Amount:</strong> ${data.amount}</p>
          ${data.nextBillingDate ? `<p><strong>Next billing:</strong> ${data.nextBillingDate}</p>` : ""}
        </div>

        <a href="${appUrl}/dashboard" class="button">Go to Dashboard</a>

        <p>Ready to train? Here are some courses to get you started:</p>
        <ul>
          <li>Fundamentals of MMA</li>
          <li>Kickboxing Foundations</li>
          <li>Grappling Essentials</li>
        </ul>

        <p>Train hard,<br>The ROA Team</p>
      </div>
    `, "Full access to all courses is now yours"),
  };
}

export function subscriptionCancelledEmail(data: {
  firstName: string;
  endDate: string;
}): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";

  return {
    subject: "Your ROA Subscription Has Been Cancelled",
    html: generateEmailWrapper(`
      <div class="content">
        <h2>We're sorry to see you go, ${data.firstName}</h2>
        <p>Your subscription to Roots Online Academy has been cancelled. You'll continue to have access until <strong>${data.endDate}</strong>.</p>

        <div class="info-box">
          <h3>Before you go</h3>
          <p>Make sure to download any certificates you've earned and save your progress notes. Your progress will be saved if you decide to return.</p>
        </div>

        <p>Changed your mind? You can reactivate your subscription anytime.</p>

        <a href="${appUrl}/pricing" class="button">Reactivate Subscription</a>

        <p>We'd love to hear your feedback on how we can improve. Just reply to this email.</p>

        <p>Best wishes,<br>The ROA Team</p>
      </div>
    `, "Your access continues until " + data.endDate),
  };
}

export function paymentFailedEmail(data: {
  firstName: string;
  amount: string;
  retryDate?: string;
}): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";

  return {
    subject: "Action Required: Payment Failed",
    html: generateEmailWrapper(`
      <div class="content">
        <h2>Payment Issue, ${data.firstName}</h2>
        <p>We weren't able to process your payment of ${data.amount} for your ROA subscription.</p>

        <div class="warning-box">
          <p><strong>Action needed:</strong> Please update your payment method to avoid any interruption to your training.</p>
        </div>

        ${data.retryDate ? `<p>We'll automatically retry the payment on <strong>${data.retryDate}</strong>.</p>` : ""}

        <a href="${appUrl}/dashboard/settings" class="button">Update Payment Method</a>

        <p>Common reasons for payment failure:</p>
        <ul>
          <li>Card expired or cancelled</li>
          <li>Insufficient funds</li>
          <li>Bank declined the transaction</li>
        </ul>

        <p>Need help? Reply to this email and we'll assist you.</p>

        <p>The ROA Team</p>
      </div>
    `, "Please update your payment method"),
  };
}

export function paymentRetryEmail(data: {
  firstName: string;
  amount: string;
  attemptNumber: number;
  finalAttempt: boolean;
}): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";
  const urgency = data.finalAttempt ? "FINAL NOTICE: " : "";

  return {
    subject: `${urgency}Payment Retry ${data.attemptNumber} - Action Required`,
    html: generateEmailWrapper(`
      <div class="content">
        <h2>${data.finalAttempt ? "Final Notice" : "Payment Reminder"}, ${data.firstName}</h2>
        <p>This is attempt ${data.attemptNumber} to process your payment of ${data.amount}.</p>

        ${data.finalAttempt ? `
        <div class="warning-box">
          <p><strong>Important:</strong> This is our final attempt. If payment fails, your subscription will be cancelled and you'll lose access to all courses.</p>
        </div>
        ` : `
        <div class="info-box">
          <p>We'll continue trying to process your payment, but please update your payment method to avoid any issues.</p>
        </div>
        `}

        <a href="${appUrl}/dashboard/settings" class="button">Update Payment Now</a>

        <p>The ROA Team</p>
      </div>
    `, data.finalAttempt ? "Final attempt - update payment to keep access" : "Please update your payment method"),
  };
}

export function trialEndingEmail(data: {
  firstName: string;
  daysLeft: number;
  plan: string;
  amount: string;
}): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";

  return {
    subject: `Your trial ends in ${data.daysLeft} day${data.daysLeft === 1 ? "" : "s"}`,
    html: generateEmailWrapper(`
      <div class="content">
        <h2>Trial Update, ${data.firstName}</h2>
        <p>Your free trial of Roots Online Academy ends in <strong>${data.daysLeft} day${data.daysLeft === 1 ? "" : "s"}</strong>.</p>

        <div class="info-box">
          <h3>What happens next?</h3>
          <p>Your ${data.plan} subscription (${data.amount}) will automatically start when your trial ends. No action needed to continue training!</p>
        </div>

        <p>Don't want to continue? You can cancel before your trial ends and won't be charged.</p>

        <a href="${appUrl}/dashboard/settings" class="button">Manage Subscription</a>

        <p>The ROA Team</p>
      </div>
    `, `Only ${data.daysLeft} days left in your trial`),
  };
}

export function courseCompletedEmail(data: {
  firstName: string;
  courseTitle: string;
  nextCourseTitle?: string;
}): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";

  return {
    subject: `Congratulations! You completed ${data.courseTitle}`,
    html: generateEmailWrapper(`
      <div class="content">
        <h2>Outstanding work, ${data.firstName}!</h2>
        <p>You've completed <strong>${data.courseTitle}</strong>! This is a significant achievement in your martial arts journey.</p>

        <div class="info-box">
          <h3>Your Certificate</h3>
          <p>A certificate of completion has been added to your profile. You can download and share it anytime.</p>
        </div>

        <a href="${appUrl}/dashboard/certificates" class="button">View Certificate</a>

        ${data.nextCourseTitle ? `
        <p><strong>Keep the momentum!</strong> Based on your progress, we recommend checking out <strong>${data.nextCourseTitle}</strong> next.</p>
        <a href="${appUrl}/courses" class="button" style="background-color: #27272a;">Browse More Courses</a>
        ` : ""}

        <p>Keep training!<br>The ROA Team</p>
      </div>
    `, "You've earned a certificate!"),
  };
}

export function certificateEarnedEmail(data: {
  firstName: string;
  courseTitle: string;
  certificateNumber: string;
}): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";

  return {
    subject: `Your Certificate for ${data.courseTitle}`,
    html: generateEmailWrapper(`
      <div class="content">
        <h2>Certificate Earned!</h2>
        <p>Congratulations, ${data.firstName}! You've earned a certificate for completing <strong>${data.courseTitle}</strong>.</p>

        <div class="info-box">
          <h3>Certificate Details</h3>
          <p><strong>Course:</strong> ${data.courseTitle}</p>
          <p><strong>Certificate #:</strong> ${data.certificateNumber}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <a href="${appUrl}/dashboard/certificates" class="button">Download Certificate</a>

        <p>Share your achievement and inspire others on their martial arts journey!</p>

        <p>The ROA Team</p>
      </div>
    `, "Download your certificate of completion"),
  };
}

export interface WeeklyDigestData {
  firstName: string;
  streakDays: number;
  lessonsWatched: number;
  totalWatchTime: string;
  coursesInProgress: Array<{ title: string; progress: number }>;
  newCourses: Array<{ title: string; discipline: string }>;
  nextMilestone?: string;
}

export function weeklyDigestEmail(data: WeeklyDigestData): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy";
  const weekOf = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const courseProgressHtml = data.coursesInProgress.length > 0
    ? data.coursesInProgress.map(c => `
        <div style="margin-bottom: 12px;">
          <p style="margin: 0 0 4px; font-weight: 500;">${c.title}</p>
          <div style="background: #e4e4e7; border-radius: 9999px; height: 8px; overflow: hidden;">
            <div style="background: #dc2626; height: 100%; width: ${c.progress}%;"></div>
          </div>
          <p style="margin: 4px 0 0; font-size: 12px; color: #71717a;">${c.progress}% complete</p>
        </div>
      `).join("")
    : "<p>Start a course to track your progress!</p>";

  const newCoursesHtml = data.newCourses.length > 0
    ? `
      <div class="info-box">
        <h3>New This Week</h3>
        ${data.newCourses.map(c => `
          <p style="margin: 8px 0;"><strong>${c.title}</strong> - ${c.discipline}</p>
        `).join("")}
      </div>
    `
    : "";

  return {
    subject: `Your Weekly Training Recap - Week of ${weekOf}`,
    html: generateEmailWrapper(`
      <div class="content">
        <h2>Hey ${data.firstName}, here's your week!</h2>
        <p>Let's see how your training went this past week.</p>

        <div style="display: flex; gap: 16px; margin: 24px 0; text-align: center;">
          <div style="flex: 1; background: #f4f4f5; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #dc2626;">${data.streakDays}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #71717a;">Day Streak</p>
          </div>
          <div style="flex: 1; background: #f4f4f5; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #18181b;">${data.lessonsWatched}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #71717a;">Lessons</p>
          </div>
          <div style="flex: 1; background: #f4f4f5; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #18181b;">${data.totalWatchTime}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #71717a;">Watch Time</p>
          </div>
        </div>

        ${data.nextMilestone ? `
        <div class="info-box" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e;">Next Milestone</h3>
          <p style="color: #92400e; margin: 0;">${data.nextMilestone}</p>
        </div>
        ` : ""}

        <h3>Course Progress</h3>
        ${courseProgressHtml}

        ${newCoursesHtml}

        <a href="${appUrl}/dashboard" class="button">Continue Training</a>

        <p style="font-size: 12px; color: #71717a; margin-top: 24px;">
          Don't want to receive these updates? <a href="${appUrl}/dashboard/settings" style="color: #dc2626;">Update your preferences</a>
        </p>

        <p>Keep pushing,<br>The ROA Team</p>
      </div>
    `, `${data.lessonsWatched} lessons watched this week!`),
  };
}
