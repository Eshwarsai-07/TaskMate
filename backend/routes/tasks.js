// routes/tasks.js
const express = require('express');
const { body, validationResult, query } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const Task = require('../models/Task');
const Log = require('../models/Log');

const router = express.Router();

/**
 * GET /api/tasks
 * query: page (1-based), limit, q (search text)
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
  ],
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const q = (req.query.q || '').trim();

      const filter = {};
      if (q) {
        // case-insensitive partial match for title or description
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ];
      }

      const total = await Task.countDocuments(filter);
      const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      res.json({ data: tasks, page, limit, totalPages: Math.ceil(total / limit), total });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/tasks
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title required').isLength({ max: 100 }),
    body('description').trim().notEmpty().withMessage('Description required').isLength({ max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      // sanitize inputs to remove HTML/script
      const title = sanitizeHtml(req.body.title, { allowedTags: [], allowedAttributes: {} });
      const description = sanitizeHtml(req.body.description, { allowedTags: [], allowedAttributes: {} });

      const task = new Task({ title, description });
      await task.save();

      // Log creation (include all fields)
      const log = new Log({
        action: 'Create Task',
        taskId: task._id,
        updatedContent: { title: task.title, description: task.description, createdAt: task.createdAt },
      });
      await log.save();

      res.status(201).json({ data: task });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /api/tasks/:id
 */
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 100 }),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty').isLength({ max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });

      const updatedFields = {};
      if (typeof req.body.title !== 'undefined') {
        updatedFields.title = sanitizeHtml(req.body.title, { allowedTags: [], allowedAttributes: {} });
      }
      if (typeof req.body.description !== 'undefined') {
        updatedFields.description = sanitizeHtml(req.body.description, { allowedTags: [], allowedAttributes: {} });
      }

      // only update changed fields
      const changed = {};
      for (const key of ['title', 'description']) {
        if (updatedFields[key] && updatedFields[key] !== task[key]) {
          changed[key] = updatedFields[key];
          task[key] = updatedFields[key];
        }
      }

      if (Object.keys(changed).length === 0) return res.status(400).json({ error: 'No changes provided' });

      await task.save();

      const log = new Log({
        action: 'Update Task',
        taskId: task._id,
        updatedContent: changed,
      });
      await log.save();

      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/tasks/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await Task.deleteOne({ _id: task._id });

    const log = new Log({
      action: 'Delete Task',
      taskId: task._id,
      updatedContent: null,
    });
    await log.save();

    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
