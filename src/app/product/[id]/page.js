// app/product/[id]/page.js

import ProductDetail from "@/components/products/product-detail";

// Enable static generation with fallback for dynamic parameters
export const dynamic = 'force-static';
export const dynamicParams = true;

// Generate static paths based on keywords
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}prod-data/header`, {
    cache: 'force-cache', // or 'no-store' if it must be dynamic (but then not static params)
  });

  const keywords = await res.json();
  const vData = keywords.products || []
  const productData = vData?.flatMap(item => item?.children)?.flatMap(item => item?.children)
  return productData.map(keyword => ({
    id: keyword?.slug,
  }));
}

// Dynamic SEO metadata with improved error handling and optimization
export async function generateMetadata({ params }) {
  // Await the params object before destructuring
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}prod-data/byId/${id}`, {
      next: { revalidate: 60 }, // revalidate every 60s
    });

    if (!res.ok) throw new Error("Failed to fetch product data");
    const product = await res.json();

    const { description, keywords, title } = product?.productData?.meta || {};
    const image = product?.productData?.image;
    const name = product?.productData?.name;
    const productUrl = `/product/${id}`;

    const defaultTitle = 'Titanium Industries';
    const defaultDescription = 'Titanium Industries is a global leader in Specialty Metals supply. Complete inventory of Titanium Round Bar, Titanium Plate & Sheet, and more.';

    const structuredData = product?.productData ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: name || defaultTitle,
      description: description || defaultDescription,
      image: image || '/default-product-image.jpg',
      url: `https://qqa.titanium.com${productUrl}`,
    } : null;

    return {
      title: {
        absolute: title || name || defaultTitle,
        template: '%s | Titanium Industries'
      },
      description: description || defaultDescription,
      keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim())) : [
        'titanium', 'specialty metals', 'industrial supplies', 'metal products'
      ],
      openGraph: {
        title: title || name || defaultTitle,
        description: description || defaultDescription,
        siteName: 'Titanium Industries, Inc.',
        url: `https://qqa.titanium.com${productUrl}`,
        images: image ? [
          {
            url: image.startsWith('http') ? image : `https://qqa.titanium.com${image}`,
            width: 1200,
            height: 630,
            alt: name || 'Product Image',
          },
        ] : [
          {
            url: 'https://qqa.titanium.com/default-social-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Titanium Industries',
          }
        ],
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: "summary_large_image",
        title: title || name || defaultTitle,
        description: description || defaultDescription,
        images: image ? [
          image.startsWith('http') ? image : `https://qqa.titanium.com${image}`
        ] : ['https://qqa.titanium.com/default-social-image.jpg'],
        creator: '@TitaniumInd',
        site: '@TitaniumInd',
      },
      metadataBase: new URL('https://qqa.titanium.com/'),
      alternates: {
        canonical: `https://qqa.titanium.com${productUrl}`,
        languages: {
          'en-US': `https://qqa.titanium.com${productUrl}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      verification: {
        google: 'your-google-verification-code',
      },
      other: {
        'format-detection': 'telephone=no',
      },
      // For structured data
      applicationLd: structuredData ? [
        JSON.stringify(structuredData)
      ] : undefined,
    };
  } catch (err) {
    console.error('Error generating metadata:', err);

    // Fallback metadata to ensure something is always returned
    return {
      title: "Titanium Industries, Inc.",
      description: "Titanium Industries is a global leader in Specialty Metals supply. Complete inventory of Titanium Round Bar, Titanium Plate & Sheet, and more.",
      metadataBase: new URL('https://qqa.titanium.com/'),
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

// Page component
const Page = async ({ params }) => {
  // Await the params object before destructuring
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  return (
    <>
      <ProductDetail id={id} />
    </>
  );
};

export default Page;