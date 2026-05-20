import client from './client';
import { Steps } from './steps';
import 'dotenv/config';

client.on('message', new Steps().handleMessage.bind(new Steps()));

client.initialize();