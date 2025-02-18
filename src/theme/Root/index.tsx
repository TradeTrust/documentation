import React, { useEffect, useState } from 'react';

const Root = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  // Set the version on the <html> tag
  const setHtmlDataVersion = (version) => {
    document.documentElement.setAttribute('data-docs-version', version);
  };

  const initializeVersion = () => {
    if (typeof window !== 'undefined') {
      const { pathname } = window.location;

      // Get the saved version from localStorage
      const savedVersion = localStorage.getItem('docs-preferred-version-default');

      // Determine the preferred version based on the pathname
      let preferredVersion = "current"; // Default version

      console.log(pathname)
      if (pathname === "/") {
        preferredVersion = savedVersion === "4.x" ? "4.x" : "current"; // Root URL logic
      } else if (pathname.includes("/docs/4.x/")) {
        preferredVersion = "4.x"; // Docs 4.x URL logic
      }

      // Store the selected version in localStorage
      localStorage.setItem("docs-preferred-version-default", preferredVersion);

      // Set HTML data version
      setHtmlDataVersion(preferredVersion);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set the client state to true after the component is mounted
      setIsClient(true);
      
      // Initialize version on first load
      initializeVersion();

      // Handle changes to localStorage via the storage event
      const handleStorageChange = (event) => {
        if (event.key === 'docs-preferred-version-default' && event.newValue) {
          setHtmlDataVersion(event.newValue);

          // Redirect to a specific URL based on the new version
          if (event.newValue === 'current') {
            window.location.replace('/docs/introduction/what-is-tradetrust/');
          } else if (event.newValue === '4.x') {
            window.location.replace('/');
          }
        }
      };

      // Listen for storage events
      window.addEventListener('storage', handleStorageChange);

      // Cleanup event listener
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner if needed
  }

  return <>{children}</>;
};

export default Root;
