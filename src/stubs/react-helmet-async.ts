import React, { ReactNode } from 'react';

/*
 * Lightweight stub replacing 'react-helmet-async'.
 * It prevents any <Helmet> tags (and thus SEO-related meta) from being
 * injected while keeping the rest of the application code intact.
 */

export const Helmet = ({ children }: { children?: ReactNode }) => {
  React.useEffect(() => {
    React.Children.forEach(children, child => {
      if (React.isValidElement(child) && child.type === 'title') {
        const titleContent = child.props.children;
        if (typeof titleContent === 'string') {
          document.title = titleContent;
        }
      }
    });
  }, [children]);
  return null;
};

export const HelmetProvider = ({ children }: { children?: ReactNode }) => {
  return children as unknown as React.ReactElement | null;
};

export default Helmet;

