import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import mongoose from 'mongoose';

import config from './config';
import syncEvents from './cron/events';
import startAPI from './lib/api';
import startChatServer from './lib/chatServer';
import scheduleCron from './lib/cron';
import serviceAccount from './serviceAccountKey.json';

dotenv.config();
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://expensify-533ca.firebaseio.com',
});

mongoose
  .connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log(`Successfully connected to database`);

    // scheduleCron(syncEvents, 'events', '*/5 * * * *');

    startAPI();
    startChatServer();
  })
  .catch((error) => {
    console.log('Error connecting to database: ', error);
    return process.exit(1);
  });
