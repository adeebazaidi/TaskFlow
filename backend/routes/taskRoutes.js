const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  reorderTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation for creating a task — title is REQUIRED (B3)
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
];

// Validation for updating a task — title is OPTIONAL (B3)
const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty if provided')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
];

router.route('/')
  .get(getTasks)
  .post(createTaskValidation, validate, createTask);

router.put('/reorder', reorderTasks);

router.route('/:id')
  .put(updateTaskValidation, validate, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', toggleTaskStatus);

module.exports = router;
