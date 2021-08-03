import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import config from './config';

import events from './routers/events';

dayjs.extend(utc);

mongoose
  .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
    authSource: config.db.name,
    native_parser: true,
    pass: config.db.pass,
    user: config.db.user,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log(`Successfully connected to database`);

    const app = express();

    app.use(cors());

    app.use('/events', events);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Explorer running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to database: ', error);
    return process.exit(1);
  });
