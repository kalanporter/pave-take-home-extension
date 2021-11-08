import express from 'express';
import { employeeRoutes } from './employees';
import { compensationRoutes } from './compensation';

// GET orgCompensationAggregates
// groupBy=startDate,employmentType,department,level,city,country,gender

// OrgCompensationAggregate {
//  name:
//  ranges: p10, p25, p50, p75, p90
// }

function getRoutes() {
  const router = express.Router();
  router.use('/v1/employees', employeeRoutes());
  router.use('/v1/orgCompensationAggregates', compensationRoutes());
  return router;
}

export { getRoutes };
