import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ProductivityChart = ({ data, pieData }) => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Area Chart for last 7 days completed tasks */}
      <div className="flex-1 min-h-[120px]">
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: -40, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="date" 
                hide={true}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  padding: '12px',
                  fontSize: '12px',
                  backgroundColor: 'var(--tw-colors-white)',
                  color: 'var(--tw-colors-slate-800)'
                }} 
                itemStyle={{
                  fontWeight: '900',
                  color: '#4f46e5'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="#4f46e5" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorTasks)" 
                animationDuration={1500}
                baseValue="0"
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>

      {/* Pie Chart for task distribution */}
      {pieData && pieData.length > 0 && (
          <div className="flex-[0.8] flex items-center justify-center">
              <div className="h-full aspect-square relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', padding: '8px', fontSize: '10px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                  {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          {entry.name} ({entry.value})
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ProductivityChart;