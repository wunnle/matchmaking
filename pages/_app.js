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
    </>
  )
}

export default MyApp
