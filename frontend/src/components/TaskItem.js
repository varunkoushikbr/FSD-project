import React from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskItem = ({ task, onToggle, onDelete }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex items-center justify-between p-4 bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-md rounded-2xl transition-all duration-300"
  >
    <div 
      className="flex items-center gap-4 flex-1 cursor-pointer" 
      onClick={() => onToggle(task._id, task.completed)}
    >
      <div className="flex-shrink-0">
        {task.completed ? 
          <CheckCircle2 size={22} className="text-emerald-500" /> : 
          <Circle size={22} className="text-slate-300 group-hover:text-indigo-400" />
        }
      </div>
      <span className={`text-[15px] font-semibold leading-snug transition-all ${
        task.completed ? 'line-through text-slate-400' : 'text-slate-700'
      }`}>
        {task.title}
      </span>
    </div>
    
    <button 
      onClick={() => onDelete(task._id)}
      className="text-slate-300 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
    >
      <Trash2 size={18} />
    </button>
  </motion.div>
);

export default TaskItem;
