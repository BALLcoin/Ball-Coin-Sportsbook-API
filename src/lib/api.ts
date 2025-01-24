import express from 'express';
import cors from 'cors';

import config from '../config';

import sportsRouter from '../routers/sports';
import eventsRouter from '../routers/events';
import betsRouter from '../routers/bets';
import usersRouter from '../routers/users';

const app = express();

app.use(cors());
app.use(express.json()); //Used to parse JSON bodies

app.use('/sports', sportsRouter);
app.use('/events', eventsRouter);
app.use('/bets', betsRouter);
app.use('/users', usersRouter);

const port = process.env.PORT || config.api.port;

const startAPI = () => {
  app.listen(port, () => {
    console.log(`Sportsbook API running on port ${port}`);
  });
};

export default startAPI;
