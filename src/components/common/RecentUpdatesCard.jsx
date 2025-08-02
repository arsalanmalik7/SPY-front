import React from 'react';
import Card from './card';

const RecentUpdatesCard = ({ updates }) => (
  <Card className="p-4 h-full">
    <div className="text-sm font-semibold text-textcolor mb-3">Recent Updates</div>
    <div className="space-y-2 mt-2">
      {updates.map((u, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className={`inline-block w-2 h-2 rounded-full ${u.type === 'removed' ? 'bg-orange-400' : 'bg-red-500'}`} />
          <span className="text-textcolor">{u.text}</span>
        </div>
      ))}
    </div>
  </Card>
);

export default RecentUpdatesCard; 