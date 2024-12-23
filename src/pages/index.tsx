import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";

const Home = () => {
  const context = useDocusaurusContext();
  const { siteConfig } = context;

  const activeVersion = localStorage.getItem("docs-preferred-version-default");

  if (!activeVersion || activeVersion === "current") {
    window.location.replace("/docs/topics/introduction/what-is-tradetrust/");
    return null;
  }

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main>
        <section className="py-16">
          <div className="container">
            <header className="max-w-2xl mx-auto text-center pb-16">
              <h1>{siteConfig.title}</h1>
              <p>{siteConfig.tagline}</p>
            </header>
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-1/5 lg:mx-8 mb-8 lg:mb-0">
                <div className="flex flex-col h-full">
                  <div className="flex-grow mb-2">
                    <img
                      className="mx-auto mb-8"
                      style={{ maxHeight: "150px" }}
                      src={useBaseUrl("img/home/home-getting-started.png")}
                      alt="Getting started"
                    />
                    <h4 className="mb-2 title">Getting Started</h4>
                    <p className="text-center">
                      A step-by-step guide to set up TradeTrust according to your application’s requirements.
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex justify-center">
                    <Link
                      className="btn bg-cerulean-500 text-white hover:text-white my-4 py-3 px-4"
                      to={useBaseUrl("docs/getting-started")}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/5 lg:mx-8 mb-8 lg:mb-0">
                <div className="flex flex-col h-full">
                  <div className="flex-grow mb-2">
                    <img
                      className="mx-auto mb-8"
                      style={{ maxHeight: "150px" }}
                      src={useBaseUrl("img/home/home-gallery.png")}
                      alt="Gallery"
                    />
                    <h4 className="mb-2 title">Gallery</h4>
                    <p className="text-center">TradeTrust documents and create yours today!</p>
                  </div>
                  <div className="flex-shrink-0 flex justify-center">
                    <a
                      className="btn bg-cerulean-500 text-white hover:text-white my-4 py-3 px-4"
                      href="https://gallery.openattestation.com/tag/trade-trust"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore
                    </a>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/5 lg:mx-8 mb-8 lg:mb-0">
                <div className="flex flex-col h-full">
                  <div className="flex-grow mb-2">
                    <img
                      className="mx-auto mb-8"
                      style={{ maxHeight: "150px" }}
                      src={useBaseUrl("img/home/home-tools.png")}
                      alt="Tools"
                    />
                    <h4 className="mb-2 title">Tools</h4>
                    <p className="text-center">
                      Additional tools you can build into TradeTrust applications to improve your workflow.{" "}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex justify-center">
                    <a
                      className="btn bg-cerulean-500 text-white hover:text-white my-4 py-3 px-4"
                      href="https://toolkit.openattestation.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
