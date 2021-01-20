import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";

const Home = () => {
  const context = useDocusaurusContext();
  const { siteConfig } = context;

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
              <div className="w-full lg:w-1/4 xl:w-1/5 lg:mx-16 px-4 mb-8 lg:mb-0">
                <img className="mb-4" src={useBaseUrl("img/home/home-getting-started.png")} alt="Getting started" />
                <h3 className="mb-2">Getting Started</h3>
                <p>A step-by-step guide to setup TradeTrust according to your application’s requirements.</p>
                <Link
                  className="btn bg-blue text-white hover:text-white my-4"
                  to={useBaseUrl("docs/introduction/what-is-tradetrust")}
                >
                  Learn more
                </Link>
              </div>
              <div className="w-full lg:w-1/4 xl:w-1/5 lg:mx-16 px-4 mb-8 lg:mb-0">
                <img className="mb-4" src={useBaseUrl("img/home/home-tools.png")} alt="Tools" />
                <h3 className="mb-2">Tools</h3>
                <p>Explore additional tools you can build into TradeTrust applications to improve your workflow. </p>
                <a
                  className="btn bg-blue text-white hover:text-white my-4"
                  href="https://toolkit.openattestation.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
