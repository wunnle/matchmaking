import { connectToDatabase } from '../../util/mongodb'

const { ObjectId } = require('mongodb')
const { OAuth2Client } = require('google-auth-library')

async function getGame(req, res) {
  console.log(req.body)

  if (req.method === 'POST') {
    const { id_token, gameId } = req.body

    if (id_token && gameId) {
      // verify google id_token & get userId

      const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_ID)

      let payload

      try {
        const ticket = await client.verifyIdToken({
          idToken: req.body.id_token,
          audience: process.env.NEXT_PUBLIC_GOOGLE_ID
        })

        payload = ticket.getPayload()
      } catch (error) {
        res.status(403).json({ message: 'Invalid Google token' })
        return
      }

      const userId = payload.sub

      const { db } = await connectToDatabase()

      const collection = db.collection('games')

      const searchQuery = { _id: ObjectId(gameId) }

      const searchOptions = {
        projection: { players: 1, settings: 1 }
      }

      const foundGame = await collection.findOne(searchQuery, searchOptions)

      if (!foundGame) {
        res.status(405).json({ message: 'no game found' })
        return
      }

      if (foundGame && foundGame.players.some(p => p.userId === userId)) {
        res.status(200).json({
          ...foundGame,
          players: foundGame.players.map(p => ({ name: p.name }))
        })
      } else {
        res.status(200).json({ message: 'you are not in this game' })
      }
    } else {
      res.status(405).json({ message: 'method not allowed' })
    }
  }
}

export default getGame
