import Head from 'next/head'
import { useEffect, useState } from 'react'
import GoogleLogin from 'react-google-login'
import { connectToDatabase } from '../util/mongodb'

export default function Home({ isConnected }) {
  const [name, setName] = useState('')
  const [signInStatus, setSignInStatus] = useState('loading')

  const responseGoogle = googleUser => {
    var profile = googleUser.getBasicProfile()
    var id_token = googleUser.getAuthResponse().id_token
    console.log('ID token', id_token)
    console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName())
    console.log('Image URL: ' + profile.getImageUrl())
    console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
    setName(profile.getName())
  }

  async function signIn() {
    var auth2 = window.gapi.auth2.getAuthInstance()
    const googleUser = await auth2.signIn({
      scope: 'profile email'
    })
    responseGoogle(googleUser)
  }

  function signOut() {
    console.log('hey')
    var auth2 = window.gapi.auth2.getAuthInstance()
    auth2.signOut().then(function () {
      console.log('User signed out.')
    })
  }

  useEffect(() => {
    const googleInterval = setInterval(() => {
      if (window.gapi) {
        console.log('LOADED')
        initGoogle()
        clearInterval(googleInterval)
      } else {
        console.log('hold on..')
      }
    }, 300)

    return () => clearInterval(googleInterval)
  }, [])

  function initGoogle() {
    console.log('initing!')

    function handleGoogleInit(auth) {
      console.log(auth)

      const isSignedIn = auth.isSignedIn.get()
      setSignInStatus(isSignedIn ? 'signedIn' : 'notSignedIn')
    }

    window.gapi.load('auth2', function () {
      console.log('load..')

      /* Ready. Make a call to gapi.auth2.init or some other API */

      if (window.gapi && process.env.NEXT_PUBLIC_GOOGLE_ID) {
        const auth = window.gapi.auth2.init({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ID
        })

        auth.then(handleGoogleInit)

        console.log({ auth })
      }
    })
  }

  return (
    <div className="container">
      <button onClick={signIn}>Sign in</button>
      <button onClick={signOut}>Sign out</button>
      <div>{signInStatus}</div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          src="https://apis.google.com/js/platform.js?onload=init"
          async
          defer
        ></script>
      </Head>
      <main>
        <h1 className="title">Matchmaking {name}</h1>
        {isConnected ? (
          <h2 className="subtitle">You are connected to MongoDB</h2>
        ) : (
          <h2 className="subtitle">
            You are NOT connected to MongoDB. Check the <code>README.md</code> for
            instructions..
          </h2>
        )}

        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>

        <div className="grid">
          <a href="https://nextjs.org/docs" className="card">
            <h3>Create a game</h3>
            <p>Lorem ipsum dolor sit amet.</p>
          </a>

          <a href="https://nextjs.org/learn" className="card">
            <h3>Find a game</h3>
            <p>Lorem ipsum dolor sit amet.</p>
          </a>
        </div>
      </main>
      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
            Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
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
    </div>
  )
}

export async function getServerSideProps(context) {
  const { client } = await connectToDatabase()

  const isConnected = await client.isConnected() // Returns true or false

  return {
    props: { isConnected }
  }
}
