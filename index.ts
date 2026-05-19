import client from './src/client';
import { Steps } from './src/steps';
import 'dotenv/config';

client.on('message', new Steps().handleMessage.bind(new Steps()));

client.initialize();