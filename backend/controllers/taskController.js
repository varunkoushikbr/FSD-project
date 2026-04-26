const Task = require('../models/Task');
const User = require('../models/User');
const { updateUserStreak } = require('../services/streakService');

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        const { title, date, estimatedTime, days = 1 } = req.body;
        const tasks = [];
        const startDate = date ? new Date(date) : new Date();

        for (let i = 0; i < days; i++) {
            const taskDate = new Date(startDate);
            taskDate.setDate(startDate.getDate() + i);
            
            const task = await Task.create({
                userId: req.user.id,
                title,
                estimatedTime: estimatedTime || 0,
                date: taskDate
            });
            tasks.push(task);
        }

        res.status(201).json(days > 1 ? tasks : tasks[0]);
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

        let pointsAwarded = 0;
        if (isMarkingComplete) {
            req.body.status = 'completed';
            
            // New Points calculation:
            // 1. Base 10 points
            // 2. 1 point for every 10 minutes worked
            // 3. Double total if actualTime <= estimatedTime
            
            const timePoints = Math.floor(task.actualTime / 10);
            pointsAwarded = 10 + timePoints;
            
            if (task.estimatedTime > 0 && task.actualTime <= task.estimatedTime) {
                pointsAwarded *= 2; // Double points for efficiency
            }
            
            req.body.points = pointsAwarded;

            // Update user total points
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { points: pointsAwarded, totalPoints: pointsAwarded }
            });
        }

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
            pointsAwarded,
            streak: streakData ? {
                currentStreak: streakData.currentStreak,
                milestoneReached: [7, 30, 100].includes(streakData.currentStreak)
            } : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Start timer
// @route   PUT /api/tasks/:id/start
exports.startTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        task.status = 'in-progress';
        task.startTime = new Date();
        await task.save();
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stop timer
// @route   PUT /api/tasks/:id/stop
exports.stopTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        if (task.startTime) {
            const endTime = new Date();
            const timeDiff = Math.round((endTime - task.startTime) / 60000); // in minutes
            task.actualTime += timeDiff;
            task.startTime = null;
            task.status = 'pending';
            await task.save();
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leaderboard
// @route   GET /api/tasks/leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .select('name totalPoints currentStreak')
            .sort({ totalPoints: -1 })
            .limit(10);
        res.json(leaderboard);
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
