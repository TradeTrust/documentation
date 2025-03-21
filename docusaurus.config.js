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
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "algolia-site-verification",
        content: "272AFA3283E853CB", // Replace with your actual user ID
      },
    },
  ],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "./docs",
          sidebarPath: require.resolve("./sidebars.json"),
          sidebarCollapsible: true,
          editUrl: "https://github.com/tradetrust/documentation/edit/master/",
          lastVersion: "current",
          versions: {
            current: {
              label: "5.x",
            },
          },
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.css"), require.resolve("./src/css/tailwind.css")],
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
        { to: "docs/4.x/getting-started", label: "Getting Started", className: "navbar-item-getting-started" },
        { to: "docs/4.x/tutorial/introduction", label: "Tutorial", className: "navbar-item-tutorial" },
        { to: "docs/4.x/topics/introduction/what-is-tradetrust", label: "Topics", className: "navbar-item-topics" },
        {
          to: "docs/4.x/reference/tradetrust-website/overview",
          label: "References",
          className: "navbar-item-references",
        },
        {
          to: "https://gallery.openattestation.com/tag/trade-trust",
          label: "Gallery",
          className: "navbar-item-gallery",
        },
        { to: "https://toolkit.openattestation.com/", label: "Tools", className: "navbar-item-tools" },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              type: "html",
              value: '<hr class="dropdown-separator">',
            },
          ],
        },
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
      apiKey: "45fb3f4d25432800827f4cd40f0a1495",
      indexName: "tradetrust",
      contextualSearch: true, // Ensures search results match the current version
      transformSearchResult: (result) => {
        if (result.url.includes("/docs/tutorial")) {
          result.url = result.url.replace("/docs/tutorial", "/docs/"); // Fix URLs for version 5.x
        } else if (result.url.includes("/docs/topics")) {
          result.url = result.url.replace("/docs/topics", "/docs/"); // Fix URLs for version 5.x
        } else if (result.url.includes("/docs/4.x/")) {
          result.url = result.url.replace("/docs/4.x/", "/docs/4.x/"); // Keep old version structure
        }
        return result;
      },
      debug: true,
      algoliaOptions: {},
    },
    prism: {
      theme: require("prism-react-renderer").themes.nightOwl,
    },
  },
  customFields: {
    GA_MEASUREMENT_ID,
  },
};

module.exports = siteConfig;
