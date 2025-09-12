import type { Metadata } from 'next';

export function generateSEOMetadata({
  title,
  description,
  keywords,
  path,
  type = 'website',
  imagePath = '/og-image.png',
}: {
  title: string;
  description: string;
  keywords: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  imagePath?: string;
}): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type,
      url: `https://appoi.ir${path}`,
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imagePath],
    },
    alternates: {
      canonical: `https://appoi.ir${path}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
