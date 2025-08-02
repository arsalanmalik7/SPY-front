import React from 'react';
import Card from './card';
import ProgressBar from './progressBar';

const COLORS = ['#FFD600', '#FFB347', '#FF99AA'];

const WineDashboardStats = ({
  wineCategory,
  styleDistribution,
  topVarietals,
  regionalDistribution,
  dietaryConsiderations,
  recentUpdates,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6 text-left">
    {/* Wine Category Distribution */}
    <Card className="p-2 h-full col-span-1">
      <div className="text-base font-semibold text-left text-textcolor mb-3">Wine Category Distribution</div>
      <div className="space-y-2 text-left">
        {wineCategory.map((item) => (
          <div key={item.label} className="flex  text-left items-center justify-between gap-2">
            <span className="text-xs text-text-main w-16">{item.label}</span>
            <ProgressBar value={item.value} max={100} showLabel={false} className="flex-1  mx-2" variant="primary" />
            <span className="text-xs text-left text-textcolor font-semibold w-8 ">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
    {/* Style Distribution */}
    <Card className="p-2 h-full col-span-1">
      <div className="text-base font-semibold text-textcolor mb-3">Style Distribution</div>
      <div className="space-y-2">
        {styleDistribution.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <span className="text-xs text-text-main w-20">{item.label}</span>
            <ProgressBar value={item.value} max={100} showLabel={false} className="flex-1 mx-2" variant="primary" />
            <span className="text-xs text-textcolor font-semibold w-8 ">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
    {/* Top Varietals */}
    <Card className="p-2 h-full col-span-1">
      <div className="text-base font-semibold text-textcolor mb-3">Top Varietals</div>
      <div className="space-y-2">
        {topVarietals.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <span className="text-xs text-text-main w-20">{item.label}</span>
            <ProgressBar value={item.value} max={100} showLabel={false} className="flex-1 mx-2" variant="primary" />
            <span className="text-xs text-textcolor font-semibold w-8 ">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
    {/* Regional Distribution */}
    <Card className="p-2 h-full col-span-1">
      <div className="text-base font-semibold text-textcolor mb-3">Regional Distribution</div>
      <div className="flex items-center gap-4">
        <svg width={80} height={80} viewBox="0 0 80 80">
          {(() => {
            const total = regionalDistribution.reduce((sum, d) => sum + d.value, 0);
            let cumulative = 0;
            return regionalDistribution.map((d, i) => {
              const startAngle = (cumulative / total) * 2 * Math.PI;
              cumulative += d.value;
              const endAngle = (cumulative / total) * 2 * Math.PI;
              const x1 = 40 + 35 * Math.cos(startAngle - Math.PI / 2);
              const y1 = 40 + 35 * Math.sin(startAngle - Math.PI / 2);
              const x2 = 40 + 35 * Math.cos(endAngle - Math.PI / 2);
              const y2 = 40 + 35 * Math.sin(endAngle - Math.PI / 2);
              const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
              return (
                <path
                  key={d.label}
                  d={`M40,40 L${x1},${y1} A35,35 0 ${largeArc} 1 ${x2},${y2} Z`}
                  fill={COLORS[i % COLORS.length]}
                />
              );
            });
          })()}
        </svg>
        <div className="space-y-1">
          {regionalDistribution.map((d, i) => (
            <div key={d.label} className="flex items-center gap-2 text-xs">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-text-main w-12">{d.label}</span>
              <span className="text-textcolor font-semibold">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
    {/* Dietary Considerations */}
    <Card className="p-2 h-full col-span-1">
      <div className="text-base font-semibold text-textcolor mb-3">Dietary Considerations</div>
      <div className="flex gap-6 items-center justify-between mt-2">
        {dietaryConsiderations.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <span className="text-xl font-bold text-textcolor">{item.value}</span>
            <span className="text-xs text-text-main mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
    {/* Recent Updates */}
    <Card className="p-2 h-full col-span-1">
      <div className="text-base font-semibold text-textcolor mb-3">Recent Updates</div>
      <div className="space-y-2 mt-2">
        {recentUpdates.map((u, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className={`inline-block w-2 h-2 rounded-full ${u.type === 'removed' ? 'bg-orange-400' : 'bg-red-500'}`} />
            <span className="text-textcolor">{u.text}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default WineDashboardStats; 