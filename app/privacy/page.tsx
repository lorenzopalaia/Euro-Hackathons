import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Database, Users } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Euro Hackathons",
  description: "Privacy Policy for Euro Hackathons platform",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="mb-0 text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Eye className="h-6 w-6" />
              1. Information We Collect
            </h2>
            <p>
              Euro Hackathons is committed to protecting your privacy. We
              collect minimal information necessary to provide our service
              effectively.
            </p>
            <h3 className="mb-2 mt-4 text-xl font-medium">
              Information You Provide
            </h3>
            <ul className="space-y-1 list-disc pl-5">
              <li>Feedback or bug reports submitted through GitHub</li>
              <li>Messages sent through our Discord server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">What&apos;s New</h2>
            <p>
              Recent frontend improvements added theme management (stored in
              browser localStorage) and enhanced filtering options. These
              features store only non-personal preferences (theme choice,
              selected filters) locally in your browser; we do not collect
              additional personal data for these features. Cookies remain
              minimal and used only for essential functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Database className="h-6 w-6" />
              2. Information Usage
            </h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>Providing and maintaining our hackathon discovery service</li>
              <li>Improving user experience and website performance</li>
              <li>Responding to user feedback and support requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              3. Data Storage and Security
            </h2>
            <p>
              Your data security is important to us. We implement appropriate
              technical and organizational measures:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>All data is stored on secure, encrypted servers</li>
              <li>
                We use Supabase (PostgreSQL) with Row Level Security enabled
              </li>
              <li>HTTPS encryption for all data transmission</li>
              <li>Regular security updates and monitoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              4. Third-Party Services
            </h2>
            <p>
              We use the following third-party services that may collect
              information:
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium">Vercel (Hosting)</h3>
                <p className="text-sm text-muted-foreground">
                  Hosts our website and may collect basic analytics data.{" "}
                  <Link
                    href="https://vercel.com/legal/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Vercel Privacy Policy
                  </Link>
                </p>
              </div>

              <div>
                <h3 className="font-medium">Supabase (Database)</h3>
                <p className="text-sm text-muted-foreground">
                  Stores hackathon data and manages our database.{" "}
                  <Link
                    href="https://supabase.com/privacy"
                    className="text-primary hover:underline"
                  >
                    Supabase Privacy Policy
                  </Link>
                </p>
              </div>

              <div>
                <h3 className="font-medium">Discord, Telegram, Twitter</h3>
                <p className="text-sm text-muted-foreground">
                  Used for notifications and community engagement. Each platform
                  has its own privacy policy.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              5. Cookies and Local Storage
            </h2>
            <p>
              We use minimal cookies and browser local storage to enhance your
              experience:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>Essential cookies for website functionality</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. We may share information only in these cases:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>When required by law or to respond to legal requests</li>
              <li>
                To protect our rights, property, or safety, or that of our users
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Users className="h-6 w-6" />
              7. Your Rights
            </h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                <strong>Access:</strong> Request information about what personal
                data we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                personal data
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                data
              </li>
              <li>
                <strong>Portability:</strong> Request a copy of your data in a
                machine-readable format
              </li>
              <li>
                <strong>Objection:</strong> Object to processing of your
                personal data
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                GitHub:{" "}
                <Link
                  href="https://github.com/lorenzopalaia/Euro-Hackathons"
                  className="text-primary hover:underline"
                >
                  Open an issue
                </Link>
              </li>
              <li>
                Discord:{" "}
                <Link
                  href="https://discord.com/invite/SmygTckVez"
                  className="text-primary hover:underline"
                >
                  Join our server
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
