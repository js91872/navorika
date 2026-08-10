'use client';

interface ArticleSchemaProps {
  title: string;
  description: string;
  date: string;
  image?: string;
  author?: string;
}

export default function ArticleSchema({ 
  title, 
  description, 
  date, 
  image = 'https://navorika.com/og-image.png',
  author = 'Navorika Team',
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Navorika',
      logo: {
        '@type': 'ImageObject',
        url: 'https://navorika.com/logo.png',
      },
    },
    datePublished: date,
    dateModified: date,
    image: image,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
