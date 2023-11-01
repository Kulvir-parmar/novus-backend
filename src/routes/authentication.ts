import { Router, Request, Response, NextFunction } from 'express';

import passport from '../utils/passport';

const authRouter: Router = Router();

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureMessage: 'Cannot sign in to Google, Please try again.',
    successRedirect: 'http://localhost:5173/',
    failureRedirect: 'http://localhost:5173/sign-in',
  }),
  (_req: Request, res: Response) => {
    res.status(200).send('You have been authenticated successfully');
  }
);

export default (router: Router): void => {
  router.use('/auth', authRouter);
};
