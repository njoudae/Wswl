import express from 'express';
import db from '../db/db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Supervisor can see their drivers and buses and passengers
router.get('/me/drivers-with-passengers', authRequired, (req, res) => {
  const userId = req.user.id;

  db.get(
    `SELECT id FROM supervisors WHERE user_id = ?`,
    [userId],
    (err, supRow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!supRow) return res.status(404).json({ message: 'Supervisor profile not found' });

      const supervisorId = supRow.id;

      db.all(
        `SELECT d.id as driver_id, du.name as driver_name, d.bus_model, d.bus_number,
                pu.name as passenger_name, pu.national_id as passenger_national_id, pu.location
         FROM drivers d
         JOIN users du ON du.id = d.user_id
         LEFT JOIN passengers p ON p.driver_id = d.id
         LEFT JOIN users pu ON pu.id = p.user_id
         WHERE d.supervisor_id = ?`,
        [supervisorId],
        (err2, rows) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: 'Database error' });
          }
          return res.json(rows);
        }
      );
    }
  );
});

export default router;
