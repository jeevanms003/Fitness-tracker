import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Activity, Utensils, Droplets, Footprints, Flame, Trophy } from 'lucide-react';
import { useAppContext } from "../context/AppProvider";

export default function DailyLog() {
  const { getStatsForDate } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const stats = useMemo(() => getStatsForDate(selectedDate), [selectedDate, getStatsForDate]);

  // Combine workouts and meals for timeline
  const timelineItems = [
    ...stats.workouts.map(w => ({
      type: 'workout',
      date: new Date(w.date),
      title: w.type,
      subtitle: `${w.duration} min`,
      value: `-${w.calories || (parseInt(w.duration) * 5)} kcal`, // Burned
      icon: Activity,
      color: "bg-emerald-500",
      textColor: "text-emerald-400"
    })),
    ...stats.meals.map(m => ({
      type: 'meal',
      date: new Date(m.date || Date.now()), // Fallback
      title: m.name,
      subtitle: `${m.protein || 0}g Pro`,
      value: `+${m.calories} kcal`, // Consumed
      icon: Utensils,
      color: "bg-orange-500",
      textColor: "text-orange-400"
    }))
  ].sort((a, b) => b.date - a.date); // Newest first

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

      {/* Date Selection Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-secondary/30 p-4 rounded-xl border border-white/5 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Daily Log</h1>
          <p className="text-muted-foreground text-sm">Review your activity and nutrition history.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Select Date:</span>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto bg-background/50 border-white/10 text-white"
          />
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Steps"
          value={stats.steps}
          unit="steps"
          icon={Footprints}
          gradient="from-emerald-500/20 to-emerald-900/10"
          borderColor="border-emerald-500/30"
          iconColor="text-emerald-400"
        />
        <SummaryCard
          title="Water"
          value={stats.waterIntake}
          unit="ml"
          icon={Droplets}
          gradient="from-blue-500/20 to-blue-900/10"
          borderColor="border-blue-500/30"
          iconColor="text-blue-400"
        />
        <SummaryCard
          title="Calories"
          value={stats.caloriesConsumed}
          unit="kcal"
          icon={Flame}
          gradient="from-orange-500/20 to-orange-900/10"
          borderColor="border-orange-500/30"
          iconColor="text-orange-400"
        />
        <SummaryCard
          title="Protein"
          value={stats.proteinConsumed}
          unit="g"
          icon={Trophy}
          gradient="from-purple-500/20 to-purple-900/10"
          borderColor="border-purple-500/30"
          iconColor="text-purple-400"
        />
      </div>

      {/* Timeline Section */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border p-6 min-h-[400px]">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Activity Timeline
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">{timelineItems.length} Entries</span>
        </h3>

        {timelineItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-4">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center">
              <Activity className="h-8 w-8 opacity-50" />
            </div>
            <p>No activity recorded for this day.</p>
          </div>
        ) : (
          <div className="relative border-l border-white/10 ml-4 space-y-8 pl-8 py-2">
            {timelineItems.map((item, i) => (
              <div key={i} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[41px] top-1 h-6 w-6 rounded-full border-2 border-background ${item.color} flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                  <item.icon className="h-3 w-3 text-white" />
                </div>

                {/* Card Content */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary/20 border border-white/5 hover:bg-secondary/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg tracking-tight">{item.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-muted-foreground uppercase">{item.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      {item.subtitle} • {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className={`text-xl font-bold font-mono ${item.textColor}`}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, unit, icon: Icon, gradient, borderColor, iconColor }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border ${borderColor} bg-gradient-to-br ${gradient} p-4 transition-all hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <span className="text-2xl font-bold block tracking-tighter">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}