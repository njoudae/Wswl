import express from 'express';
import db from '../db/db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Passenger can see their driver
router.get('/me/driver', authRequired, (req, res) => {
  const userId = req.user.id;
  db.get(
    `SELECT p.driver_id
     FROM passengers p
     WHERE p.user_id = ?`,
    [userId],
    (err, prow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!prow || !prow.driver_id) {
        return res.status(404).json({ message: 'Driver not assigned' });
      }

      db.get(
        `SELECT d.id as driver_id, u.name, u.national_id, u.phone, d.bus_model, d.bus_number
         FROM drivers d
         JOIN users u ON u.id = d.user_id
         WHERE d.id = ?`,
        [prow.driver_id],
        (err2, row) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: 'Database error' });
          }
          if (!row) return res.status(404).json({ message: 'Driver not found' });
          return res.json(row);
        }
      );
    }
  );
});

export default router;
