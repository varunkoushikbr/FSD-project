const Task = require('../models/Task');
const { updateUserStreak } = require('../services/streakService');

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        const { title, date } = req.body;

        const task = await Task.create({
            userId: req.user.id,
            title,
            date: date || new Date()
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tasks by date
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
    try {
        const { date } = req.query;
        let query = { userId: req.user.id };
        
        if (date) {
            const searchDate = new Date(date);
            const startOfDay = new Date(searchDate.setHours(0,0,0,0));
            const endOfDay = new Date(searchDate.setHours(23,59,59,999));
            
            query.date = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        const tasks = await Task.find(query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const isMarkingComplete = req.body.completed === true && task.completed === false;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        let streakData = null;
        if (isMarkingComplete) {
            streakData = await updateUserStreak(req.user.id);
        }

        res.json({
            task: updatedTask,
            streak: streakData ? {
                currentStreak: streakData.currentStreak,
                milestoneReached: [7, 30, 100].includes(streakData.currentStreak)
            } : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
