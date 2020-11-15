import { connectToDatabase } from '../../util/mongodb'

const { OAuth2Client } = require('google-auth-library')

async function createGame(req, res) {
  if (req.method === 'POST') {
    if (req?.body?.id_token) {
      const { id_token, settings } = req.body
      const { map, playerCount, gameCode, playerName } = settings

      const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_ID)

      try {
        const ticket = await client.verifyIdToken({
          idToken: req.body.id_token,
          audience: process.env.NEXT_PUBLIC_GOOGLE_ID
        })

        ticket.getPayload()

        const { db } = await connectToDatabase()

        const collection = db.collection('games')

        // check if host has a game already

        const searchQuery = { hostId: id_token }
        const searchOptions = {
          sort: { rating: -1 },
          projection: { _id: 1 }
        }

        const existingGame = await collection.findOne(searchQuery, searchOptions)

        if (existingGame) {
          res.status(200).json({ message: 'already exists', gameId: existingGame._id })
        } else {
          const doc = {
            createdAt: Date.now(),
            settings: { map, playerCount, gameCode, host: playerName },
            hostId: id_token,
            players: [{ name: playerName, id_token }]
          }
          const result = await collection.insertOne(doc)
          res.status(200).json({ message: 'created', gameId: result.insertedId })
        }
      } catch (error) {
        res.status(403).json({ message: 'Invalid Google token' })
        return
      }
    } else {
      res.status(400).end('bad request')
    }
  } else {
    res.status(405).end('method not allowed')
  }
}

export default createGame
