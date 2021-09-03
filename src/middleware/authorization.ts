import {Request, Response, NextFunction} from 'express';
import admin from 'firebase-admin';
import createUpdateUser from '../lib/createUpdateUser';

const authorization = (role?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        res.status(401).send('No authorization header provided');
        return;
      }

      const authHeaderComponents = req.headers.authorization.split(' ');
      const authToken = authHeaderComponents[1];

      await createUpdateUser(authToken);

      const decodedAuthToken = await admin.auth().verifyIdToken(authToken);
      req.uid = decodedAuthToken.uid;
      next();
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  };
};

export default authorization;
