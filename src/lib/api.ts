import chalk from 'chalk';
import cors from 'cors';
import express from 'express';

import config from '../config';
import betsRouter from '../routers/bets';
import eventsRouter from '../routers/events';
import sportsRouter from '../routers/sports';
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
    console.log(`${chalk.green('[API]')} running on port ${chalk.blue(port)}`);
  });
};

export default startAPI;
