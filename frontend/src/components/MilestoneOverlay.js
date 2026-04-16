import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const MilestoneOverlay = ({ milestone, onClose }) => {
  useEffect(() => {
    if (milestone) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#81C784', '#2E7D32']
      });
    }
  }, [milestone]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div 
          className="milestone-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="milestone-modal"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 100 }}
          >
            <div className="milestone-icon-large">🎉</div>
            <h2>{milestone} Day Streak!</h2>
            <p>You're on fire! Keep up the amazing work.</p>
            <button onClick={onClose} className="btn-primary">Awesome!</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneOverlay;
