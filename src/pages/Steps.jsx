import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footprints, Plus, Minus } from 'lucide-react';
import { useAppContext } from "../context/AppProvider";

export default function Steps() {
    const { stats, updateSteps, goals } = useAppContext();
    const [localSteps, setLocalSteps] = useState(stats.steps);

    useEffect(() => {
        setLocalSteps(stats.steps);
    }, [stats.steps]);

    const handleUpdate = async () => {
        await updateSteps(parseInt(localSteps) || 0);
    };

    const adjustSteps = (amount) => {
        const newVal = Math.max((parseInt(localSteps) || 0) + amount, 0);
        setLocalSteps(newVal);
        updateSteps(newVal);
    };

    const progress = Math.min((localSteps / goals.steps) * 100, 100);

    return (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            <Card className="text-center shadow-2xl border-none bg-gradient-to-b from-card to-background relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

                <CardHeader className="relative z-10">
                    <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 shadow-xl border-4 ${progress >= 100 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
                        <Footprints className={`h-10 w-10 ${progress >= 100 ? 'animate-bounce' : ''}`} />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Step Tracker</CardTitle>
                    <CardDescription className="text-lg">Keep moving to reach your daily goal.</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="py-6">
                        <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600 mb-2 tracking-tighter">
                            {localSteps} <span className="text-2xl text-muted-foreground font-normal ml-2">steps</span>
                        </div>
                        <p className="text-muted-foreground font-medium">Daily Goal: {goals.steps} steps</p>
                    </div>

                    <div className="w-full bg-secondary/50 h-8 rounded-full overflow-hidden mb-10 relative border border-white/5 shadow-inner">
                        <div
                            className={`h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.5)] ${progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-green-600'}`}
                            style={{ width: `${progress}%` }}
                        />
                        <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-20">
                            {Math.round(progress)}%
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-8">
                        <Button variant="outline" size="icon" onClick={() => adjustSteps(-100)} className="h-12 w-12 border-destructive/30 hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all">
                            <Minus className="h-5 w-5" />
                        </Button>
                        <div className="w-40">
                            <Input
                                type="number"
                                value={localSteps}
                                onChange={(e) => setLocalSteps(e.target.value)}
                                onBlur={handleUpdate}
                                className="text-center text-2xl h-12 bg-secondary/50 border-white/10 focus:border-emerald-500/50 font-bold"
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={() => adjustSteps(100)} className="h-12 w-12 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-4 bg-secondary/20 rounded-xl border border-white/5">
                        <Button variant="ghost" className="hover:bg-emerald-500/10 hover:text-emerald-400 h-auto py-3 flex flex-col gap-1" onClick={() => adjustSteps(500)}>
                            <span className="text-lg font-bold">+ 500</span>
                            <span className="text-xs text-muted-foreground">Walk</span>
                        </Button>
                        <Button variant="ghost" className="hover:bg-emerald-500/10 hover:text-emerald-400 h-auto py-3 flex flex-col gap-1 border-x border-white/5 rounded-none" onClick={() => adjustSteps(1000)}>
                            <span className="text-lg font-bold">+ 1k</span>
                            <span className="text-xs text-muted-foreground">Run</span>
                        </Button>
                        <Button variant="ghost" className="hover:bg-emerald-500/10 hover:text-emerald-400 h-auto py-3 flex flex-col gap-1" onClick={() => adjustSteps(5000)}>
                            <span className="text-lg font-bold">+ 5k</span>
                            <span className="text-xs text-muted-foreground">Hike</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
