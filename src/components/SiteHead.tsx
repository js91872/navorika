export default function SiteHead() {
  return (
      <head>
        {/* Google Analytics - Direct head injection */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZH4XRJSDLZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZH4XRJSDLZ');
            `,
          }}
        />
      </head>
  );
}
