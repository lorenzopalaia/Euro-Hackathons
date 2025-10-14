/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://euro-hackathons.vercel.app",
  generateRobotsTxt: true,
  priority: 1,
  transform: async (config, path) => {
    if (path === "/docs" || path === "/privacy" || path === "/terms") {
      return {
        loc: path,
        changefreq: "yearly",
        priority: 0.8,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
