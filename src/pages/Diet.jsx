import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';

export default function Diet() {
  const { meals, addMeal, removeMeal, goals } = useAppContext();
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '' });
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter meals for the selected date
  // Note: meals date string might need careful comparison
  const dailyMeals = meals.filter(m => {
    const mealDate = new Date(m.date || Date.now()).toISOString().split('T')[0];
    return mealDate === date;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMeal.name && newMeal.calories) {
      // Use selected date but current time for ordering
      const selected = new Date(date);
      const now = new Date();
      selected.setHours(now.getHours(), now.getMinutes());

      await addMeal({
        name: newMeal.name,
        calories: parseInt(newMeal.calories),
        protein: parseInt(newMeal.protein || 0),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: selected.toISOString()
      });
      setNewMeal({ name: '', calories: '', protein: '' });
    }
  };

  const handleQuickAdd = async (name, calories, protein) => {
    const selected = new Date(date);
    const now = new Date();
    selected.setHours(now.getHours(), now.getMinutes());

    await addMeal({
      name,
      calories,
      protein,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: selected.toISOString()
    });
  };

  const totalCalories = dailyMeals.reduce((acc, curr) => acc + parseInt(curr.calories || 0), 0);
  const calorieProgress = Math.min((totalCalories / goals.calories) * 100, 100);

  return (
    <div className="grid gap-8 md:grid-cols-12 animate-in fade-in duration-500 pb-20">
      <div className="md:col-span-8 space-y-6">
        <Card className="border-none bg-gradient-to-br from-card via-card to-background relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Daily Nutrition</CardTitle>
                <CardDescription>Monitor your intake to meet your goals.</CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Utensils className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {dailyMeals.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-white/5 rounded-xl bg-black/20">
                <Utensils className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No meals logged for {date === new Date().toISOString().split('T')[0] ? 'today' : 'this date'}.</p>
                <p className="text-xs mt-1">Add your first meal to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyMeals.map((meal) => (
                  <div key={meal.id || meal._id} className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all hover:scale-[1.01] hover:shadow-lg group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                        <Utensils className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{meal.name}</p>
                        <p className="text-xs text-muted-foreground font-mono bg-white/5 px-1.5 py-0.5 rounded inline-block mt-1">{meal.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg text-orange-400">{meal.calories} <span className="text-xs text-muted-foreground font-normal">kcal</span></p>
                        <p className="text-xs text-muted-foreground">{meal.protein || 0}g protein</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => removeMeal(meal.id || meal._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-6 border-t border-white/5 mt-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Total Intake</span>
                  <div className="text-3xl font-bold text-white">{totalCalories} <span className="text-sm font-normal text-muted-foreground">/ {goals.calories} kcal</span></div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${calorieProgress > 100 ? 'text-destructive' : 'text-orange-500'}`}>{Math.round(calorieProgress)}%</span>
                </div>
              </div>
              <div className="w-full bg-secondary/50 h-4 rounded-full overflow-hidden shadow-inner border border-white/5">
                <div
                  className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(249,115,22,0.5)] ${calorieProgress > 100 ? 'bg-destructive' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}
                  style={{ width: `${calorieProgress}%` }}
                ></div>
              </div>
              {calorieProgress > 100 && <p className="text-xs text-destructive mt-2 font-medium flex items-center gap-1 animate-pulse">⚠️ Calorie limit exceeded!</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-4 space-y-6">
        <Card className="border-none bg-gradient-to-b from-card to-background shadow-xl">
          <CardHeader>
            <CardTitle>Log Food</CardTitle>
            <CardDescription>What did you eat?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-secondary/50 border-white/10 focus:border-orange-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Name</label>
                <Input
                  placeholder="e.g. Grilled Chicken"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  className="bg-secondary/50 border-white/10 focus:border-orange-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Calories</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    className="bg-secondary/50 border-white/10 focus:border-orange-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Protein (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                    className="bg-secondary/50 border-white/10 focus:border-orange-500/50"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-lg shadow-orange-500/20">
                <Plus className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </form>

            <div className="mt-8">
              <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Quick Add</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleQuickAdd("Water (Glass)", 0, 0)} className="hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/50">+ Water</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAdd("Coffee", 5, 0)} className="hover:bg-amber-700/10 hover:text-amber-500 hover:border-amber-500/50">+ Coffee</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAdd("Banana", 105, 1)} className="hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/50">+ Banana</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAdd("Protein Shake", 150, 25)} className="hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/50">+ Shake</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}