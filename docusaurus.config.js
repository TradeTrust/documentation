const GA_MEASUREMENT_ID = "G-Z4JTBB0GN7";

const siteConfig = {
  title: "TradeTrust Developer Hub",
  tagline:
    "Integrate TradeTrust framework in your apps to future-ready your digital infrastructure for electronic trade documents.",
  url: "https://www.tradetrust.io",
  baseUrl: "/",
  projectName: "website",
  organizationName: "IMDA",
  favicon: "img/favicon.svg",
  stylesheets: ["https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap"],
  plugins: [require.resolve("./docusaurus-plugin/src")], // monkey patch webpack config -> https://docusaurus.io/docs/next/api/plugin-methods/lifecycle-apis#configureWebpack
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "./docs",
          sidebarPath: require.resolve("./sidebars.json"),
          sidebarCollapsible: true,
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
        width: 168,
        height: 50,
      },
      items: [
        { to: "docs/introduction/what-is-tradetrust", label: "Docs" },
        { to: "https://github.com/TradeTrust", label: "Github" },
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
              to: "docs/introduction/what-is-tradetrust",
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
      appId: "BH4D9OD16A",
      apiKey: "2c96d58935843a5e1a0f4e53ea18300e",
      indexName: "tradetrust",
      algoliaOptions: {},
    },
    prism: {
      theme: require("prism-react-renderer/themes/nightOwl"),
    },
  },
  customFields: {
    GA_MEASUREMENT_ID,
  },
};

module.exports = siteConfig;
