import { Employees } from '../models/employees';

const get = async (req, res) => {
  res.json({ ok: true });
};

export const employees = { get };
