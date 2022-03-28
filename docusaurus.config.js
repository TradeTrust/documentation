const siteConfig = {
  title: "TradeTrust Developer Hub",
  tagline:
    "Integrate TradeTrust framework in your apps to future-ready your digital infrastructure for electronic trade documents.",
  url: "https://www.tradetrust.io",
  baseUrl: "/",
  projectName: "website",
  organizationName: "IMDA",
  favicon: "img/favicon.svg",
  stylesheets: ["https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@700&display=swap"],
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
          trackingID: "G-7YL3CX08LM",
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: "TradeTrust",
      logo: {
        alt: "TradeTrust Logo",
        src: "img/logo/logo-tt.svg",
        srcDark: "img/logo/logo-tt.svg",
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
              html: `<a href="https://www.tradetrust.io" target="_blank" rel="noreferrer noopener"><img src="/img/logo/logo-tt-full.svg" alt="TradeTrust Logo" style="max-width: 140px;" /></a>`,
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
};

module.exports = siteConfig;
