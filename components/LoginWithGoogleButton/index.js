import { useSession, signin, signout } from 'next-auth/client'

const LoginWithGoogleButton = () => {
  const [session, loading] = useSession()

  return (
    <p>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={signin}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={signout}>Sign out</button>
        </>
      )}
    </p>
  )
}

export default LoginWithGoogleButton
