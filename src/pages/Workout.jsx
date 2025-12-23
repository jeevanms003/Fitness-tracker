import { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Clock, Plus, Trash2 } from 'lucide-react';

export default function Workout() {
  const { workouts, addWorkout, removeWorkout } = useAppContext();
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type && duration && date) {
      await addWorkout({ type, duration, date });
      setType('');
      setDuration('');
    }
  };

  const handleRemove = async (id) => {
    await removeWorkout(id);
  }

  return (
    <div className="grid gap-8 md:grid-cols-12 animate-in fade-in duration-500 pb-20">
      {/* Form Section */}
      <div className="md:col-span-4 space-y-6">
        <Card className="border-none bg-gradient-to-b from-card to-background shadow-xl">
          <CardHeader>
            <CardTitle>Log Workout</CardTitle>
            <CardDescription>Record your latest training session.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-9 bg-secondary/50 border-white/10 focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Workout Type</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Running, Bench Press..."
                    className="pl-9 bg-secondary/50 border-white/10 focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (min)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="45"
                    className="pl-9 bg-secondary/50 border-white/10 focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/20">
                <Plus className="mr-2 h-4 w-4" /> Add Workout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <div className="md:col-span-8">
        <Card className="h-full border-none bg-secondary/20 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>History</CardTitle>
                <CardDescription>Your past workout sessions.</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-black/20 m-4">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-emerald-500/50" />
                </div>
                <h3 className="text-lg font-semibold">No workouts yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Log your first workout to start tracking your progress!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workouts.map((w) => (
                  <div key={w.id || w._id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-card/50 hover:bg-card transition-all hover:scale-[1.01] hover:shadow-md group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{w.type}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(w.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-lg text-emerald-400">{w.duration} <span className="text-sm text-muted-foreground font-normal">min</span></p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemove(w.id || w._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}