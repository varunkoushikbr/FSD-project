const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getTasks, 
    updateTask, 
    deleteTask, 
    startTask, 
    stopTask, 
    getLeaderboard 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.get('/leaderboard', protect, getLeaderboard);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.put('/:id/start', protect, startTask);
router.put('/:id/stop', protect, stopTask);

module.exports = router;
