import express from 'express'

import { exampleFunc } from '../../utils/example'

const app = express()

app.get('/', (req, res) => {
  if (exampleFunc()) res.send('works')
  res.send('Yo')
})

app.listen(process.env.PORT, () => console.warn('listening'))
