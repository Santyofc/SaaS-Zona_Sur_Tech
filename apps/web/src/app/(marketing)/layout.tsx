import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Script from "next/script";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script 
        id="adsense"
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8338467922774671"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Header />
      {children}
      <Footer />
    </>
  );
}
