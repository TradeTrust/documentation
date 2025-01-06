import React, { useEffect, useState } from 'react';

const Root = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  // Set the version on the <html> tag
  const setHtmlDataVersion = (version) => {
    document.documentElement.setAttribute('data-docs-version', version);
  };

  const initializeVersion = () => {
    if (typeof window !== 'undefined') {
      const savedVersion = localStorage.getItem('docs-preferred-version-default');
      if (savedVersion) {
        setHtmlDataVersion(savedVersion);
      } else {
        // Default to "current" if no saved version exists
        setHtmlDataVersion('current');
      }
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
