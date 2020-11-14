function MyApp({ Component, pageProps }) {
  return (
    <>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
      <script
        src="https://apis.google.com/js/platform.js?onload=init"
        async
        defer
      ></script>
      <Component {...pageProps} />
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
            Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}

export default MyApp
