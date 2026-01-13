import { NextResponse } from 'next/server';

export function middleware(request) {
  const currentUser = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;
  const adminUser = ['admin', 'sub-admin']
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isQuick = pathname.startsWith('/quick-quote');
  const isCustomerQuote = pathname.startsWith('/customer');
  const isMainPage = pathname === '/';

  // if url has query params for discount so that we can allow access to that page > discounted-products & /customer wil be removed in params  
  // http://localhost:5004/customer/discounted-products?product=Alloy+Steel&form=Round+Bar&grade=8740&spec=Centerless+Ground+Annealed%2C+Per+AMS+6322%2C+AMS+2301%2C+ASTM+A331&dim=%C3%98+0.885%22
  const queryparams = request.nextUrl.searchParams.get('product');
  // console.log('queryparams', queryparams)


  if (currentUser && isQuick) {
    return NextResponse.redirect(new URL('/customer/quick-quote', request.url));
  }
  if (currentUser && adminUser.includes(currentUser) && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url));
  }
  if (currentUser === 'customer' && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users away from /dashboard pages
  if ((isCustomerQuote || isDashboardPage) && !queryparams && !currentUser) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // // Redirect logged-in users away from the main page
  // if (isMainPage && currentUser) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*', '/customer/:path*', '/dashboard/:path*', '/auth/:path*'],
};
