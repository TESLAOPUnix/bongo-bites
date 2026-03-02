import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export default function SEOHead({ title, description, canonical, ogImage, ogType = 'website' }: SEOHeadProps) {
  useEffect(() => {
    const suffix = ' | Bongo Hridoy';
    const fullTitle = title ? `${title.slice(0, 60)}${suffix}` : 'Bongo Hridoy – Authentic Bengali Products';
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      setMeta('description', description.slice(0, 160));
      setMeta('og:description', description.slice(0, 160), 'property');
    }

    setMeta('og:title', fullTitle, 'property');
    setMeta('og:type', ogType, 'property');

    if (ogImage) setMeta('og:image', ogImage, 'property');

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    return () => {
      document.title = 'Bongo Hridoy – Authentic Bengali Products';
    };
  }, [title, description, canonical, ogImage, ogType]);

  return null;
}
