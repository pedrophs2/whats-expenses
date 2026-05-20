import client from './client';
import { Steps } from './steps';
import 'dotenv/config';
import express from 'express';

client.on('message', new Steps().handleMessage.bind(new Steps()));

client.initialize();

const port = process.env.PORT || 4000 
// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })