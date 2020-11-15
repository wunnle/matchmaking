import { connectToDatabase } from '../../util/mongodb'

const { OAuth2Client } = require('google-auth-library')

async function findGame(req, res) {
  if (req.method === 'POST') {
    if (req?.body?.id_token) {
      const { settings } = req.body
      const { map, playerName } = settings

      try {
        const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_ID)
        const ticket = await client.verifyIdToken({
          idToken: req.body.id_token,
          audience: process.env.NEXT_PUBLIC_GOOGLE_ID
        })

        const payload = ticket.getPayload()

        const userId = payload.sub

        // check if player has a game already as host

        const { db } = await connectToDatabase()

        const collection = db.collection('games')

        const searchQuery = { hostId: userId }
        const searchOptions = {
          sort: { players: 1 },
          projection: { _id: 1 }
        }

        const existingGame = await collection.findOne(searchQuery, searchOptions)

        if (existingGame) {
          res.status(200).json({ message: 'already exists', gameId: existingGame._id })
          return
        }

        const bestGameQuery = { isFull: false, 'settings.map': map }

        const bestGameOptions = {
          sort: { playerCount: -1 }
        }

        const bestGame = await collection.findOne(bestGameQuery, bestGameOptions)

        if (!bestGame) {
          res.status(200).json({ message: 'no games available' })
        } else {
          if (bestGame.players.some(p => p.userId === userId)) {
            res.status(200).json({ message: 'already in game', gameId: bestGame._id })
            return
          }

          const update = {
            $set: {
              playerCount: bestGame.playerCount + 1,
              isFull: !(bestGame.playerCount < bestGame.settings.maxPlayers),
              players: [
                ...bestGame.players,
                {
                  name: playerName,
                  userId
                }
              ]
            }
          }

          const updatedGame = await collection.findOneAndUpdate(
            { _id: bestGame._id },
            update,
            { returnNewDocument: true }
          )

          if (updatedGame) {
            res.status(200).json({ message: 'updated game', gameId: bestGame._id })
          }
        }
      } catch (error) {
        res.status(403).json({ message: 'Invalid Google token' })
        return
      }
    }
  } else {
    res.status(405).end('method not allowed')
  }
}

export default findGame
