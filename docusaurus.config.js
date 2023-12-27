require("dotenv").config();

const GA_MEASUREMENT_ID = "G-Z4JTBB0GN7";

const siteConfig = {
  title: "TradeTrust Documentation",
  tagline:
    "Integrate TradeTrust framework in your apps to future-ready your digital infrastructure for electronic trade documents.",
  url: "https://www.tradetrust.io",
  baseUrl: "/",
  projectName: "website",
  organizationName: "IMDA",
  favicon: "img/favicon.svg",
  stylesheets: ["https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap"],
  plugins: [require.resolve("./docusaurus-plugin/src")], // monkey patch webpack config -> https://docusaurus.io/docs/next/api/plugin-methods/lifecycle-apis#configureWebpack
  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
  },
  onBrokenLinks: "warn",
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "./docs",
          sidebarPath: require.resolve("./sidebars.json"),
          sidebarCollapsible: true,
          editUrl: "https://github.com/tradetrust/documentation/edit/master/",
        },
        theme: {
          customCss: [require.resolve("./src/css/tailwind.css")],
        },
        gtag: {
          trackingID: GA_MEASUREMENT_ID,
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      logo: {
        alt: "TradeTrust Logo",
        src: "img/logo/logo-tt-full.svg",
        srcDark: "img/logo/logo-tt-full.svg",
      },
      items: [
        { to: "docs/getting-started", label: "Getting Started" },
        { to: "docs/tutorial/introduction", label: "Tutorial" },
        { to: "docs/topics/introduction/what-is-tradetrust", label: "Topics" },
        { to: "docs/reference/tradetrust-website/overview", label: "References" },
      ],
    },
    footer: {
      links: [
        {
          items: [
            {
              html: `<a href="https://www.tradetrust.io" target="_blank" rel="noreferrer noopener"><img src="/img/logo/logo-tt-full.svg" alt="TradeTrust Logo" style="max-width: 142px;" /></a>`,
            },
          ],
        },
        {
          title: "Docs",
          items: [
            {
              to: "docs/getting-started",
              label: "Getting Started",
            },
          ],
        },
        {
          title: "Source Code",
          items: [
            {
              href: "https://github.com/TradeTrust",
              label: "Github",
            },
          ],
        },
        {},
        {},
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TradeTrust`,
    },
    algolia: {
      appId: "6DNGPTCB04",
      apiKey: process.env.ALGOLIA_SEARCH_API_KEY || "dummykey",
      indexName: "tradetrust",
      algoliaOptions: {},
    },
  },
  customFields: {
    GA_MEASUREMENT_ID,
  },
};

module.exports = siteConfig;
