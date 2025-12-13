// app/sitemap.ts (Next.js App Router)
export default async function sitemap() {
    const baseUrl = 'https://qqa.titanium.com';

    // 1. Static pages
    const staticRoutes = [
        '',
        'faq',
        'privacy',
        'product',
        'quick-quote',
        'services', 'terms', 'tools/calculator', 'tools/references',
        'privacy-policy', 'terms-of-service',
        'auth/login',
        'auth/register',
        'customer/cart',
        'customer/dashboard',
        'customer/discounted-products',
        'customer/faq',
        'customer/mill-products',
        'customer/orders',
        'customer/profile-account',
        'customer/quick-quote',
        'customer/quotes',
        'customer/services',
        'customer/terms',
    ].map((path) => ({
        url: `${baseUrl}/${path}`,
    }));

    // 2. Dynamic product pages from your API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}prod-data/seo-header`, {
        cache: 'force-cache',
    });

    const json = await res.json();
    const productData = json?.products?.flatMap((item) => item?.children)?.flatMap((item) => item?.children) || [];

    const productRoutes = productData.map((item) => ({
        url: `${baseUrl}/product/${item?.slug}`,
    }));


    return [
        ...staticRoutes,
        ...productRoutes,
    ];
}
