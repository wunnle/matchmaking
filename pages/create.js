import { useState } from 'react'
import useGoogleLogin, { googleSignInStatuses } from '../hooks/useGoogleLogin'
import { postData } from '../util/apiHelpers'

const CreateGame = () => {
  const { signInStatus, signIn, user } = useGoogleLogin()

  const { id_token } = user

  const [map, setMap] = useState('skeld')
  const [playerCount, setPlayerCount] = useState(9)
  const [gameCode, setGameCode] = useState()
  const [playerName, setPlayerName] = useState()
  const [creatingGame, setCreatingGame] = useState(false)

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

  const PlayerCountRadio = ({ value, name }) => (
    <div style={{ marginRight: 10 }}>
      <input
        type="radio"
        id={value}
        name="playerCount"
        value={value}
        checked={playerCount === value}
        onChange={() => setPlayerCount(value)}
      />
      <label htmlFor={value}>{name}</label>
    </div>
  )

  async function handleSubmit(e) {
    e.preventDefault()
    console.log('will set the game with', {
      map,
      playerCount,
      gameCode
    })
    setCreatingGame(true)

    const res = await postData('/api/createGame', {
      id_token,
      settings: { map, playerCount, gameCode, playerName }
    })

    console.log({ res })

    if (res.gameId) {
      setCreatingGame(false)
    }

    console.log(`will redirect to ${res.gameId}`)
  }

  if (creatingGame) {
    return <div>Creating game...</div>
  }

  return (
    <div style={{ width: 600, margin: 'auto' }}>
      <h1>Create a game here</h1>
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
            <p>How many more players do you need?</p>
            <div style={{ display: 'flex' }}>
              {[5, 6, 7, 8, 9].map(n => (
                <PlayerCountRadio value={n} name={n} key={`count${n}`} />
              ))}
            </div>
          </div>
          <div>
            <p>What's the game password?</p>
            <input
              type="text"
              maxLength="6"
              value={gameCode}
              required
              onChange={e =>
                setGameCode(e.target.value.replaceAll(/[^a-zA-Z]/g, '').toUpperCase())
              }
            />
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
          <button style={{ marginTop: 20 }}>Create game</button>
        </form>
      )}
    </div>
  )
}

export default CreateGame
