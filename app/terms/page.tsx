import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - Euro Hackathons",
  description: "Terms of Service for Euro Hackathons platform",
};

export default function TermsPage() {
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
          <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
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
            <h2 className="mb-4 text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Euro Hackathons (&quot;the Service&quot;),
              you accept and agree to be bound by the terms and provision of
              this agreement. If you do not agree to abide by the above, please
              do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              2. Description of Service
            </h2>
            <p>
              Euro Hackathons is a free platform that aggregates and displays
              information about hackathons happening across Europe. We provide:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Listing of European hackathons</li>
              <li>
                • Real-time notifications through Discord, Telegram, and Twitter
              </li>
              <li>• Advanced filtering and search capabilities</li>
              <li>• RESTful API access to hackathon data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. Use License</h2>
            <p>
              Permission is granted to temporarily access and use Euro
              Hackathons for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title, and under
              this license you may not:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Modify or copy the materials</li>
              <li>
                • Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                • Attempt to reverse engineer any software contained on the
                website
              </li>
              <li>
                • Remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="mt-2 space-y-1">
              <li>
                • Violate any local, state, national, or international law
              </li>
              <li>
                • Transmit any material that is defamatory, offensive, or
                otherwise objectionable
              </li>
              <li>
                • Attempt to gain unauthorized access to any portion of the
                Service
              </li>
              <li>
                • Interfere with or disrupt the Service or servers connected to
                the Service
              </li>
              <li>• Use automated scripts to extract large amounts of data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. API Usage</h2>
            <p>
              Our API is provided free of charge for reasonable usage. We
              reserve the right to implement rate limiting and may restrict
              access for abusive usage patterns. Commercial usage of our API
              requires prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Data Accuracy</h2>
            <p>
              While we strive to provide accurate and up-to-date information
              about hackathons, we cannot guarantee the accuracy, completeness,
              or timeliness of the information displayed. Users should verify
              details directly with event organizers before making any
              commitments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              7. Third-Party Links
            </h2>
            <p>
              Our Service contains links to third-party websites and services.
              We are not responsible for the content, privacy policies, or
              practices of these third-party sites. We encourage you to review
              the terms and privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Disclaimer</h2>
            <p>
              The information on this website is provided on an &quot;as
              is&quot; basis. To the fullest extent permitted by law, Euro
              Hackathons excludes all representations, warranties, conditions
              and other terms which might otherwise be implied by statute,
              common law or the law of equity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Limitations</h2>
            <p>
              In no event shall Euro Hackathons or its suppliers be liable for
              any damages (including, without limitation, damages for loss of
              data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on Euro Hackathons&apos;
              website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Revisions</h2>
            <p>
              Euro Hackathons may revise these terms of service at any time
              without notice. By using this website, you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              11. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us through our{" "}
              <Link
                href="https://github.com/lorenzopalaia/Euro-Hackathons"
                className="text-primary hover:underline"
              >
                GitHub repository
              </Link>{" "}
              or join our{" "}
              <Link
                href="https://discord.gg/SmygTckVez"
                className="text-primary hover:underline"
              >
                Discord server
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
