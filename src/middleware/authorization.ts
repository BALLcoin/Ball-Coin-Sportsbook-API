import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';

import createUpdateUser from '../lib/createUpdateUser';

const authorization = (requiresAdmin = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        res.status(401).send('No authorization header provided');
        return;
      }

      const authToken = req.headers.authorization.split(' ')[1];
      const decodedAuthToken = await admin.auth().verifyIdToken(authToken);

      // Creates or updates the user in the database
      await createUpdateUser(authToken);

      req.uid = decodedAuthToken.uid;
      next();
    } catch (err) {
      console.log(chalk.red(err));
      res.status(500).send('Internal server error');
    }
  };
};

export default authorization;
