const { useEffect, useState } = require('react')

export const googleSignInStatuses = {
  loading: 'loading',
  signedIn: 'signedIn',
  notSignedIn: 'notSignedIn',
  signedOut: 'signedOut'
}

function useGoogleLogin() {
  const [user, setUser] = useState({})
  const [signInStatus, setSignInStatus] = useState('loading')

  useEffect(() => {
    function initGoogle() {
      function handleGoogleInit(auth) {
        const isSignedIn = auth.isSignedIn.get()
        setSignInStatus(isSignedIn ? 'signedIn' : 'notSignedIn')

        if (isSignedIn) {
          const googleUser = auth.currentUser.get()
          setUserDetails(googleUser)
        }
      }

      window.gapi.load('auth2', function () {
        if (window.gapi && process.env.NEXT_PUBLIC_GOOGLE_ID) {
          const auth = window.gapi.auth2.init({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_ID
          })

          auth.then(handleGoogleInit)
        }
      })
    }

    const googleInterval = setInterval(() => {
      if (window.gapi) {
        initGoogle()
        clearInterval(googleInterval)
      }
    }, 300)

    return () => clearInterval(googleInterval)
  }, [])

  const setUserDetails = googleUser => {
    var profile = googleUser.getBasicProfile()
    var id_token = googleUser.getAuthResponse().id_token
    console.log('ID token', id_token)
    console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName())
    console.log('Image URL: ' + profile.getImageUrl())
    console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.

    setUser({
      id_token,
      profileId: profile.getId(),
      name: profile.getName(),
      imgUrl: profile.getImageUrl(),
      email: profile.getImageUrl()
    })
  }

  async function signIn() {
    var auth2 = window.gapi.auth2.getAuthInstance()
    const googleUser = await auth2.signIn({
      scope: 'profile email'
    })
    setSignInStatus(googleSignInStatuses.signedIn)
    setUserDetails(googleUser)
  }

  function signOut() {
    var auth2 = window.gapi.auth2.getAuthInstance()
    auth2.signOut().then(function () {
      setSignInStatus('signedOut')
      setUser({})
    })
  }

  return { signInStatus, user, signIn, signOut }
}

export default useGoogleLogin
