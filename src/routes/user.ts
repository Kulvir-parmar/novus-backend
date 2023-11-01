import { Router } from 'express';

import { isAuthenticated } from '../middlewares/authentication';

export default (router: Router): void => {
  router.get('/auth/user', isAuthenticated, (req, res) => {
    res.json(req.user);
  });
};
