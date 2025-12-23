import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Flame, Footprints, Droplets, ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppProvider";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, stats, goals, workouts, getStatsForDate } = useAppContext();

  // Calculate last 7 days data dynamically
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayStats = getStatsForDate(dateStr);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      cal: dayStats.caloriesBurned || 0, // Plotting Calories Burned
      // You could also plot consumed vs burned if you want multiple areas
    };
  });

  // Dynamic Data from Context
  const dashboardStats = [
    {
      title: "Steps",
      value: stats.steps,
      target: goals.steps,
      unit: "steps",
      icon: Footprints,
      color: "text-emerald-500",
      progress: Math.min((stats.steps / goals.steps) * 100, 100)
    },
    {
      title: "Calories Consumed",
      value: stats.caloriesConsumed,
      target: goals.calories,
      unit: "kcal",
      icon: Flame,
      color: "text-orange-500",
      progress: Math.min((stats.caloriesConsumed / goals.calories) * 100, 100)
    },
    {
      title: "Active Time",
      value: stats.activeMinutes,
      target: goals.activeMinutes,
      unit: "mins",
      icon: Activity,
      color: "text-blue-500",
      progress: Math.min((stats.activeMinutes / goals.activeMinutes) * 100, 100)
    },
    {
      title: "Water",
      value: stats.waterIntake,
      target: goals.water,
      unit: "ml",
      icon: Droplets,
      color: "text-cyan-500",
      progress: Math.min((stats.waterIntake / goals.water) * 100, 100)
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hi, {user.name} 👋</h2>
          <p className="text-muted-foreground">Keep up the energy! Here is your daily summary.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/workout"><Button>Log Workout</Button></Link>
          <Link to="/diet"><Button variant="secondary">Log Meal</Button></Link>
          <Link to="/steps"><Button variant="outline">Log Steps</Button></Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border-none bg-secondary/20 backdrop-blur-sm relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(stat.title)} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                / {stat.target} {stat.unit}
              </p>
              <Progress value={stat.progress} className="mt-3 h-2" indicatorClassName={getIndicatorClass(stat.title)} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity & Progress Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Weekly Activity Chart (Mock for Visuals, can be made dynamic with more history data) */}
        <Card className="col-span-4 shadow-md">
          <CardHeader>
            <CardTitle>Weekly Activity Patterns</CardTitle>
            <CardDescription>Your consistency over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Area type="monotone" dataKey="cal" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts List (Dynamic) */}
        <Card className="col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>
              Your latest sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {workouts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No workouts logged yet.</p>
              ) : (
                workouts.slice().reverse().slice(0, 5).map((workout, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{workout.type}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(workout.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-sm text-right">
                      {workout.duration} min
                      <div className="text-[10px] text-muted-foreground uppercase">{workout.calories || parseInt(workout.duration) * 5} kcal</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/workout">
              <Button variant="ghost" className="w-full mt-4 flex items-center gap-2">
                View All History <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getGradient(title) {
  switch (title) {
    case "Steps": return "from-emerald-500 to-green-500";
    case "Calories Consumed": return "from-orange-500 to-red-500";
    case "Active Time": return "from-blue-500 to-cyan-500";
    case "Water": return "from-cyan-400 to-blue-600";
    default: return "from-gray-500 to-slate-500";
  }
}

function getIndicatorClass(title) {
  switch (title) {
    case "Steps": return "bg-emerald-500";
    case "Calories Consumed": return "bg-orange-500";
    case "Active Time": return "bg-blue-500";
    case "Water": return "bg-cyan-500";
    default: return "bg-primary";
  }
}