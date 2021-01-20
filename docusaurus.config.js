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
          editUrl: "https://github.com/TradeTrust/documentation/tree/master",
        },
        theme: {
          customCss: [require.resolve("./src/css/tailwind.css")],
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
              html: `<a href="https://www.tradetrust.io" target="_blank" rel="noreferrer noopener"><img src="/static/img/logo/logo-tt-full.svg" alt="TradeTrust Logo" style="max-width: 140px;" /></a>`,
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
      apiKey: "1c7e0f08161cfc504494cff933eb8a37",
      indexName: "openattestation",
      algoliaOptions: {},
    },
    prism: {
      theme: require("prism-react-renderer/themes/nightOwl"),
    },
    sidebarCollapsible: true,
  },
};

module.exports = siteConfig;
