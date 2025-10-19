// routes/logs.js
const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

/**
 * GET /api/logs
 * optional ?page & ?limit
 */
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const total = await Log.countDocuments();
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ data: logs, page, limit, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
