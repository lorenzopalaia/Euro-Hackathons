import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - HackTrack EU",
  description: "Terms of Service for HackTrack EU platform",
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
              By accessing and using HackTrack EU (&quot;the Service&quot;), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              2. Description of Service
            </h2>
            <p>
              HackTrack EU is a free platform that aggregates and displays
              information about hackathons happening across Europe. We provide:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>Listing of European hackathons</li>
              <li>
                Real-time notifications through Discord, Telegram, and Twitter
              </li>
              <li>Advanced filtering and search capabilities</li>
              <li>RESTful API access to hackathon data</li>
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
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempt to reverse engineer any software contained on the
                website
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                Engage in any activity that disrupts or interferes with the
                security, integrity, or performance of the Service
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or its
                related systems or networks
              </li>
              <li>
                Use any robot, spider, or other automated device, process, or
                means to access the Service for any purpose
              </li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              5. API Access and Usage
            </h2>
            <p>
              HackTrack EU may provide you with access to the Application
              Programming Interface (&quot;API&quot;) to enable you to access
              certain data and functionality of the Service. Your use of the API
              is subject to these Terms and any additional terms and conditions
              provided by HackTrack EU.
            </p>
            <p>
              You agree to use the API only for purposes that are permitted by
              these Terms and any applicable law, regulation, or generally
              accepted practices or guidelines in the relevant jurisdictions.
            </p>
            <p>
              HackTrack EU reserves the right to suspend or terminate your
              access to the API at any time, with or without cause, and with or
              without notice.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              API key and for all activities that occur under your API key. You
              agree to notify HackTrack EU immediately of any unauthorized use
              of your API key or any other breach of security.
            </p>
            <p>
              HackTrack EU may impose limitations on the use of the API,
              including but not limited to the frequency and volume of requests,
              and the amount of data accessed or retrieved. These limitations
              may be updated from time to time at HackTrack EU&apos; sole
              discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">What&apos;s New</h2>
            <p>
              Recent updates include expanded filtering options, a theme
              management system (with presets and light/dark mode stored in
              localStorage), and a revamped scheduling pipeline for the data
              ingestion jobs which now runs multiple times per day with
              staggered cron windows to reduce load. The API rate limits have
              also been clarified in the API section.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Changes to Terms</h2>
            <p>
              HackTrack EU reserves the right, at its sole discretion, to modify
              or replace these Terms at any time. If the alteration is material,
              HackTrack EU will provide notice via the Service or by some other
              means. What constitutes a &quot;material&quot; change will be
              determined at HackTrack EU&apos; sole discretion.
            </p>
            <p>
              By continuing to access or use the Service after revisions become
              effective, you agree to be bound by the revised terms. If you do
              not agree to the new terms, you are no longer authorized to use
              the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which HackTrack EU is established,
              without regard to its conflict of law principles.
            </p>
            <p>
              Any legal action or proceeding arising out of or relating to these
              Terms or the Service shall be brought exclusively in the courts
              located in the jurisdiction in which HackTrack EU is established,
              and you consent to the jurisdiction of such courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              8. Contact Information
            </h2>
            <p>
              For any questions about these Terms, please contact us at{" "}
              <Link
                href="https://discord.com/invite/SmygTckVez"
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
