import { useState } from 'react'
import useGoogleLogin, { googleSignInStatuses } from '../hooks/useGoogleLogin'
import { postData } from '../util/apiHelpers'

const FindAndJoinGame = () => {
  const { signInStatus, signIn, user } = useGoogleLogin()

  const { id_token } = user

  const [map, setMap] = useState('skeld')
  const [playerName, setPlayerName] = useState()
  const [findingGame, setFindingGame] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await postData('/api/findAndJoinGame', {
      id_token,
      settings: { map, playerName }
    })
    console.log({ res })
  }

  if (signInStatus === googleSignInStatuses.loading) {
    return <div>Loading...</div>
  }

  const MapRadio = ({ value, name }) => (
    <div style={{ marginRight: 10 }}>
      <input
        type="radio"
        id={value}
        name="map"
        value={value}
        checked={map === value}
        onChange={() => setMap(value)}
      />
      <label htmlFor={value}>{name}</label>
    </div>
  )

  return (
    <div style={{ width: 600, margin: 'auto' }}>
      <h1>Find a game</h1>
      {signInStatus !== googleSignInStatuses.signedIn && (
        <div>
          <div>You need to sign in to continue</div>
          <button onClick={signIn}>Sign in with Google</button>
        </div>
      )}
      {signInStatus === googleSignInStatuses.signedIn && (
        <form onSubmit={handleSubmit}>
          <div>
            <p>Which map</p>
            <div style={{ display: 'flex' }}>
              <MapRadio value="skeld" name="The Skeld" />
              <MapRadio value="mira" name="MIRA HQ" />
              <MapRadio value="polus" name="Polus" />
            </div>
          </div>
          <div>
            <p>What's your player name?</p>
            <input
              type="text"
              maxLength="10"
              value={playerName}
              required
              onChange={e => setPlayerName(e.target.value)}
            />
          </div>
        </form>
      )}
    </div>
  )
}

export default FindAndJoinGame
