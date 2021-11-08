import express from 'express';
import bodyParser from 'body-parser';
import { body, validationResult } from 'express-validator';

import { controller } from '../controllers';

function compensationRoutes() {
  const router = express.Router();

  router.get('/', controller.compensation.list);

  return router;
}

export { compensationRoutes };
