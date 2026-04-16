const User = require('../models/User');

/**
 * Updates user streak when a task is completed.
 * Logic:
 * - If lastCompletedDate was yesterday: currentStreak + 1
 * - If lastCompletedDate was today: do nothing (already updated)
 * - If lastCompletedDate was before yesterday: currentStreak = 1
 */
exports.updateUserStreak = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    if (lastDate) {
        const diffInTime = today.getTime() - lastDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        if (diffInDays === 0) {
            // Already completed a task today, no streak change
            return user;
        } else if (diffInDays === 1) {
            // Completed yesterday, continue streak
            user.currentStreak += 1;
        } else {
            // Missed a day or more, reset streak
            user.currentStreak = 1;
        }
    } else {
        // First task ever completed
        user.currentStreak = 1;
    }

    // Update longest streak
    if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
    }

    user.lastCompletedDate = new Date();
    await user.save();

    // Check Milestones
    const milestones = [7, 30, 100];
    if (milestones.includes(user.currentStreak)) {
        console.log(`Milestone reached: ${user.currentStreak} day streak!`);
        // You could trigger a notification or award a badge here
    }

    return user;
};
