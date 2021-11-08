import express from 'express';
import bodyParser from 'body-parser';
import { body, validationResult } from 'express-validator';

import { controller } from '../controllers';

function employeeRoutes() {
  const router = express.Router();

  router.get('/:employeeId', controller.employees.get);

  return router;
}

export { employeeRoutes };
