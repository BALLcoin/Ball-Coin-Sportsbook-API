import mongoose from 'mongoose';
import admin from 'firebase-admin';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';

import scheduleCron from './lib/cron';
import syncEvents from './cron/events';
import syncOdds from './cron/odds';

import startAPI from './lib/api';
import startChatServer from './lib/chatServer';

import serviceAccount from './serviceAccountKey.json';
import config from './config';

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://expensify-533ca.firebaseio.com',
});

mongoose
  // .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
  //   authSource: config.db.name,
  //   native_parser: true,
  //   pass: config.db.pass,
  //   user: config.db.user,
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  .connect(
    'mongodb+srv://jack:Jack.29e9bca2@cluster0.h7o7z.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )

  .then(() => {
    console.log(`Successfully connected to database`);

    scheduleCron(syncEvents, 'events', '0 * * * *');
    scheduleCron(syncOdds, 'odds');

    startAPI();
    startChatServer();
  })
  .catch((error) => {
    console.log('Error connecting to database: ', error);
    return process.exit(1);
  });
