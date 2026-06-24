const Task = require('../models/Task');

// Escape special regex characters to prevent ReDoS attacks (S3)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Allowed sort field whitelist to prevent injection (B2)
const ALLOWED_SORTS = {
  'custom': { position: 1, createdAt: -1 },
  '-createdAt': { createdAt: -1 },
  'createdAt': { createdAt: 1 },
  '-updatedAt': { updatedAt: -1 },
  'updatedAt': { updatedAt: 1 },
  'priority': { priority: 1 },
  'title': { title: 1 },
  '-title': { title: -1 },
};

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, search, priority, sort = '-createdAt' } = req.query;

    // Build the filter for actual task query
    const taskFilter = { userId: req.user._id };

    if (status && ['pending', 'completed'].includes(status)) {
      taskFilter.status = status;
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      taskFilter.priority = priority;
    }

    if (search && search.trim()) {
      const escaped = escapeRegex(search.trim());
      taskFilter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
      ];
    }

    // Sanitize sort param — fall back to default if invalid (B2)
    const sortQuery = ALLOWED_SORTS[sort] || { position: 1, createdAt: -1 };

    // Run tasks query and global stats in parallel (B1 — 2 queries instead of 3)
    const [tasks, statsResult] = await Promise.all([
      Task.find(taskFilter).sort(sortQuery).lean(),
      Task.aggregate([
        { $match: { userId: req.user._id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const stats = statsResult[0] || { total: 0, pending: 0, completed: 0 };
    // Remove _id from stats output
    const { _id, ...cleanStats } = stats;

    res.status(200).json({
      success: true,
      count: tasks.length,
      stats: cleanStats,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Only overwrite fields that were explicitly provided in the request body (B3)
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
};

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.status}!`,
      task,
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update task status.' });
  }
};

// @desc    Bulk reorder tasks (update status and position)
// @route   PUT /api/tasks/reorder
// @access  Private
const reorderTasks = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'updates must be an array' });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.id, userId: req.user._id },
        update: { $set: { position: update.position, status: update.status } },
      }
    }));

    await Task.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Tasks reordered successfully',
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ success: false, message: 'Failed to reorder tasks.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus, reorderTasks };
