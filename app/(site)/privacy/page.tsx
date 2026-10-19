export const metadata = {
  title: "Privacy Policy – annamettifogo.com",
  description: "Privacy Policy for annamettifogo.com"
};

export default function PrivacyPage() {
  return (
    <main className="max-w-[670px] mx-auto prose prose-neutral mx-auto px-6 py-12">
      <h1>Privacy Policy</h1>

      <p>
        This website (annamettifogo.com) is a personal blog. I do not collect personal
        information directly. No accounts, forms, or user data are required to use
        the site.
      </p>

      <h2>Hosting</h2>
      <p>
        The site is hosted on Vercel. As part of their standard operations, Vercel
        may collect basic technical data such as IP addresses and request logs. You
        can read their privacy policy on their official website.
      </p>

      <h2>Analytics</h2>
      <p>
        I do not use Google Analytics or any third-party tracking services.
      </p>

      <h2>Database (Views Counter)</h2>
      <p>
        A small Supabase database is used to count page views. This system only
        stores aggregated numbers and does not track or identify users.
      </p>

      <h2>Embedded Content</h2>
      <p>
        Some articles include embedded YouTube videos. YouTube may collect data
        according to their own privacy policy when you play or interact with an
        embedded video.
      </p>

      <h2>Affiliate Links</h2>
      <p>
        This website uses Amazon Affiliate links. If you click an Amazon link
        containing the tag <code>mywebsitemett-21</code> and make a purchase,
        I may earn a small commission at no additional cost to you.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about this Privacy Policy, you can contact me through the
        information available on the website or via my public profiles.
      </p>

      <p>Last updated: {new Date().getFullYear()}</p>
    </main>
  );
}
