import Link from "next/link";

const email = "lorenzopalaia53@gmail.com";
const lastUpdated = "Dec 2024";

export default function Privacy() {
  return (
    <main className="container mx-auto max-w-2xl space-y-16 px-4">
      <article className="prose dark:prose-invert mt-8 pb-16">
        <h1 className="title text-5xl">Privacy Policy</h1>
        <p>Last Updated: {lastUpdated}</p>
        <div className="space-y-4">
          <h2 className="title text-3xl">Hey, Welcome!</h2>
          <p>
            Thanks for stopping by! This <b>Privacy Policy</b> is here to let
            you know how things work around here. Our website is dedicated to
            showcasing hackathons and allowing users to add new ones without the
            need for registration. We respect your privacy and are committed to
            protecting it.
          </p>
          <h2 className="title">What Information We Collect</h2>
          <p>
            Since you can add hackathons without registering, we don't collect
            much personal information.
          </p>
          <h3>1. Contact Info</h3>
          <p>
            If you reach out via email, the info you provide is entirely up to
            you. We will only use it to reply and have a conversation with
            you—no funny business.
          </p>
          <h2 className="title">How We Use the Info</h2>
          <p>Here's what we might do with any information we collect:</p>
          <ul className="list-disc">
            <li>Ensure the site is running smoothly</li>
            <li>Improve the website based on feedback you might share</li>
            <li>Respond to your questions or feedback</li>
            <li>Verify the authenticity of the hackathons submitted</li>
          </ul>
          <h2 className="title">Sharing Your Info</h2>
          <p>
            We don't sell, trade, or rent your personal info. If you shared
            something sensitive by accident, feel free to reach out, and we'll
            help you remove it.
          </p>
          <h2 className="title">Security</h2>
          <p>
            We'll do our best to keep any info you share safe, but let's be
            real—no system is foolproof. While we'll take reasonable steps to
            protect your info, we can't promise 100% security.
          </p>
          <h2 className="title">Policy Updates</h2>
          <p>
            This policy is current as of <b>{lastUpdated}</b>. If we make any
            changes, we'll update it here, so you're always in the loop. Feel
            free to check back occasionally, but don't worry—we're not making
            any big changes without letting you know.
          </p>
          <h2 className="title">Got Questions?</h2>
          <p>
            If you have any questions, concerns, or just want to say hi, drop us
            an email at <Link href={`mailto:${email}`}>{email}</Link>. We'd love
            to hear from you!
          </p>
        </div>
      </article>
    </main>
  );
}
