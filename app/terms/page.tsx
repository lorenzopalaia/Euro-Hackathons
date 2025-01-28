import Link from "next/link";

const email = "lorenzopalaia53@gmail.com";
const lastUpdated = "Dec 2024";

export default function Terms() {
  return (
    <main className="container mx-auto max-w-2xl space-y-16 px-4">
      <article className="prose mt-8 pb-16 dark:prose-invert">
        <h1 className="title text-5xl">Terms & Conditions</h1>
        <p>Last Updated: {lastUpdated}</p>
        <div className="space-y-4">
          <h2 className="title text-3xl">Welcome to Our Website!</h2>
          <p>
            These <b>Terms & Conditions</b> outline the rules and regulations
            for the use of our website. By accessing this website, we assume you
            accept these terms and conditions. Do not continue to use the
            website if you do not agree to all of the terms and conditions
            stated on this page.
          </p>
          <h2 className="title">License</h2>
          <p>
            Unless otherwise stated, we own the intellectual property rights for
            all material on the website. All intellectual property rights are
            reserved. You may access this from the website for your own personal
            use subjected to restrictions set in these terms and conditions.
          </p>
          <h3>You must not:</h3>
          <ul className="list-disc">
            <li>Republish material from the website</li>
            <li>Sell, rent, or sub-license material from the website</li>
            <li>Reproduce, duplicate, or copy material from the website</li>
            <li>Redistribute content from the website</li>
          </ul>
          <h2 className="title">Hyperlinking to our Content</h2>
          <p>
            The following organizations may link to our website without prior
            written approval:
          </p>
          <ul className="list-disc">
            <li>Government agencies</li>
            <li>Search engines</li>
            <li>News organizations</li>
            <li>
              Online directory distributors may link to our website in the same
              manner as they hyperlink to the websites of other listed
              businesses
            </li>
            <li>
              System-wide Accredited Businesses except soliciting non-profit
              organizations, charity shopping malls, and charity fundraising
              groups which may not hyperlink to our website
            </li>
          </ul>
          <h2 className="title">iFrames</h2>
          <p>
            Without prior approval and written permission, you may not create
            frames around our web pages that alter in any way the visual
            presentation or appearance of our website.
          </p>
          <h2 className="title">Content Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on
            your website. You agree to protect and defend us against all claims
            that is rising on your website. No link(s) should appear on any
            website that may be interpreted as libelous, obscene, or criminal,
            or which infringes, otherwise violates, or advocates the
            infringement or other violation of, any third party rights.
          </p>
          <h2 className="title">Your Privacy</h2>
          <p>
            Please read our <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <h2 className="title">Reservation of Rights</h2>
          <p>
            We reserve the right to request that you remove all links or any
            particular link to our website. You approve to immediately remove
            all links to our website upon request. We also reserve the right to
            amend these terms and conditions and it&apos;s linking policy at any
            time. By continuously linking to our website, you agree to be bound
            to and follow these linking terms and conditions.
          </p>
          <h2 className="title">Removal of links from our website</h2>
          <p>
            If you find any link on our website that is offensive for any
            reason, you are free to contact and inform us any moment. We will
            consider requests to remove links but we are not obligated to or so
            or to respond to you directly.
          </p>
          <h2 className="title">Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all
            representations, warranties, and conditions relating to our website
            and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc">
            <li>
              Limit or exclude our or your liability for death or personal
              injury
            </li>
            <li>
              Limit or exclude our or your liability for fraud or fraudulent
              misrepresentation
            </li>
            <li>
              Limit any of our or your liabilities in any way that is not
              permitted under applicable law
            </li>
            <li>
              Exclude any of our or your liabilities that may not be excluded
              under applicable law
            </li>
          </ul>
          <h2 className="title">Contact Us</h2>
          <p>
            If you have any questions about these Terms & Conditions, please
            contact us at <Link href={`mailto:${email}`}>{email}</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}
