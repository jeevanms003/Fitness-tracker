import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Plus, Minus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useAppContext } from "../context/AppProvider";

export default function Water() {
  const { setWaterIntake: syncWater, goals, getStatsForDate } = useAppContext();
  // Note: We renamed setWaterIntake to syncWater in destructure to avoid confusion, 
  // as we want to call the context method which maps to server sync.

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [localWater, setLocalWater] = useState(0);

  // Fetch stats for the selected date
  const stats = getStatsForDate(date);
  // We use local state to allow immediate UI updates while valid data syncs, 
  // OR we can just use stats.waterIntake directly if 'getStatsForDate' is responsive enough (it depends on AppProvider state).
  // The AppProvider updates 'dailyStatsHistory' optimistically, so 'stats.waterIntake' should be correct immediately.
  const currentWater = stats.waterIntake || 0;

  const addWater = (amount) => {
    const newVal = Math.min(currentWater + amount, 10000);
    syncWater(newVal, date);
  };

  const removeWater = (amount) => {
    const newVal = Math.max(currentWater - amount, 0);
    syncWater(newVal, date);
  };

  const handleManualChange = (val) => {
    syncWater(val, date);
  }

  const progress = Math.min((currentWater / goals.water) * 100, 100);

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <Card className="text-center shadow-2xl border-none bg-gradient-to-b from-card to-background relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

        <CardHeader className="relative z-10">
          <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 shadow-xl border-4 ${progress >= 100 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
            <Droplets className={`h-10 w-10 ${progress >= 100 ? 'animate-bounce' : ''}`} />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Hydration Tracker</CardTitle>
          <CardDescription className="text-lg">Stay hydrated to perform at your best.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">

          <div className="mb-6 flex justify-center">
            <div className="w-1/2">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-secondary/50 border-white/10 text-center"
              />
            </div>
          </div>

          <div className="py-6 flex justify-center items-center">
            <input
              type="number"
              value={currentWater}
              onChange={(e) => handleManualChange(parseInt(e.target.value) || 0)}
              className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 tracking-tighter w-48 text-center bg-transparent border-b border-transparent hover:border-white/10 focus:border-cyan-500 focus:outline-none transition-all"
            />
            <span className="text-2xl text-muted-foreground font-normal ml-2 mb-2">ml</span>
          </div>
          <p className="text-muted-foreground font-medium">Daily Goal: {goals.water} ml</p>

          <div className="w-full bg-secondary/50 h-8 rounded-full overflow-hidden mb-10 relative border border-white/5 shadow-inner">
            <div
              className={`h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(6,182,212,0.5)] ${progress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-cyan-400 to-blue-600'}`}
              style={{ width: `${progress}%` }}
            />
            <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-20">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="flex justify-center gap-4 max-w-sm mx-auto mb-8">
            <Button variant="outline" size="lg" onClick={() => removeWater(250)} className="h-14 border-destructive/30 hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all flex-1">
              <Minus className="mr-2 h-5 w-5" /> 250ml
            </Button>
            <Button size="lg" onClick={() => addWater(250)} className="h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 border-0 flex-1">
              <Plus className="mr-2 h-5 w-5" /> 250ml
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={() => handleManualChange(0)} className="text-xs text-muted-foreground hover:text-white mb-6">
            Reset Daily Counter
          </Button>

          <div className="grid grid-cols-3 gap-3 p-4 bg-secondary/20 rounded-xl border border-white/5">
            <Button variant="ghost" className="hover:bg-cyan-500/10 hover:text-cyan-400 h-auto py-3 flex flex-col gap-1" onClick={() => addWater(100)}>
              <span className="text-lg font-bold">+ 100</span>
              <span className="text-xs text-muted-foreground">Sip</span>
            </Button>
            <Button variant="ghost" className="hover:bg-cyan-500/10 hover:text-cyan-400 h-auto py-3 flex flex-col gap-1 border-x border-white/5 rounded-none" onClick={() => addWater(500)}>
              <span className="text-lg font-bold">+ 500</span>
              <span className="text-xs text-muted-foreground">Bottle</span>
            </Button>
            <Button variant="ghost" className="hover:bg-cyan-500/10 hover:text-cyan-400 h-auto py-3 flex flex-col gap-1" onClick={() => addWater(1000)}>
              <span className="text-lg font-bold">+ 1L</span>
              <span className="text-xs text-muted-foreground">Jug</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visual Cups Visualization */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 justify-items-center opacity-90 p-6 bg-secondary/10 rounded-2xl border border-white/5 backdrop-blur-sm">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`relative h-12 w-8 border-2 rounded-md flex items-end justify-center pb-0.5 transition-all duration-500 ${(currentWater / 250) >= (i + 1)
            ? 'border-cyan-400/50 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
            : 'border-muted bg-background/50'
            }`}>
            <div className={`w-[80%] rounded-sm transition-all duration-700 ease-out ${(currentWater / 250) >= (i + 1) ? 'h-[80%] bg-cyan-400' : 'h-0 bg-transparent'
              }`}></div>
          </div>
        ))}
        <p className="col-span-full text-center text-xs font-mono text-muted-foreground mt-2 w-full pt-2 border-t border-white/5 uppercase tracking-widest">
          1 Cell ≈ 250ml
        </p>
      </div>
    </div>
  );
}