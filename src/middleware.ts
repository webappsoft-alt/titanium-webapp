import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;
  const adminUser = ['admin', 'sub-admin']
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isQuick = pathname.startsWith('/quick-quote');
  const isCustomerQuote = pathname.startsWith('/customer/quick-quote');
  const isMainPage = pathname === '/';

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
  if ((isCustomerQuote || isDashboardPage) && !currentUser) {
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
