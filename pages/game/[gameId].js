import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useGoogleLogin, { googleSignInStatuses } from '../../hooks/useGoogleLogin'
import { postData } from '../../util/apiHelpers'

const Game = () => {
  const router = useRouter()
  const { gameId } = router.query
  const { signInStatus, signIn, user } = useGoogleLogin()
  const { id_token } = user

  const [players, setPlayers] = useState()
  const [settings, setSettings] = useState()
  const [gameStatus, setGameStatus] = useState('waiting')

  useEffect(() => {
    async function getGame() {
      setGameStatus('loading')
      const game = await postData('/api/getGame', { gameId, id_token })

      setPlayers(game.players)
      setSettings(game.settings)
      setGameStatus('loaded')
    }

    if (gameId && id_token) {
      getGame()
    }
  }, [gameId, id_token])

  if (signInStatus === googleSignInStatuses.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {gameStatus === 'loading' && <div>loading game</div>}
      {gameStatus === 'loaded' && (
        <div>
          <div>
            <p>
              Game code: <strong>{settings.gameCode}</strong>
            </p>
            <p>Map: {settings.map}</p>
            <p>Players</p>
            {players.map(p => (
              <p>{p.name}</p>
            ))}
          </div>
        </div>
      )}
      {signInStatus !== googleSignInStatuses.signedIn && (
        <div>
          <div>You need to sign in to continue</div>
          <button onClick={signIn}>Sign in with Google</button>
        </div>
      )}
    </div>
  )
}
export default Game
