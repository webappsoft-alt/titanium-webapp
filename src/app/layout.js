import "./globals.css";
import 'react-phone-number-input/style.css'
import '@/styles/main.scss';
import Providers from "./providers";
import Script from "next/script";

export const metadata = {
  title: {
    default: "Titanium Industries, Inc. | Global Specialty Metals Supply & Distribution",
    template: `%s | Titanium Industries, Inc. | Global Specialty Metals Supply & Distribution`,
  },
  description: "Global supplier of titanium round bar, stainless steel round bar, nickel alloys, and specialty metals for aerospace, defense, and medical industries. Get a fast quote today.",
  manifest: "/site.webmanifest",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />

      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
      </Script>
      <Script
        id="tawk-chat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function () {
              var s1 = document.createElement("script"),
                  s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = "https://embed.tawk.to/59566d8d50fd5105d0c835ae/default";
              s1.charset = "UTF-8";
              s1.setAttribute("crossorigin", "*");
              s0.parentNode.insertBefore(s1, s0);
            })();
          `,
        }}
      />
    </html>
  );
}
