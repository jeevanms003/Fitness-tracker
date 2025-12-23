import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Target, Award, Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';

export default function Profile() {
  const { user, setUser, goals, setGoals } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [goalData, setGoalData] = useState(goals);

  const handleSave = () => {
    setUser(formData);
    setGoals(goalData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <div className="ml-auto">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                disabled={!isEditing}
                value={isEditing ? formData.name : user.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                disabled={!isEditing}
                value={isEditing ? formData.email : user.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fitness Goal</label>
              <Input
                disabled={!isEditing}
                value={isEditing ? formData.goal : user.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                type="number"
                disabled={!isEditing}
                value={isEditing ? formData.weight : user.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          {/* Daily Goals Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" /> Daily Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Calorie Target</label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? goalData.calories : goals.calories}
                  onChange={(e) => setGoalData({ ...goalData, calories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Step Target</label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? goalData.steps : goals.steps}
                  onChange={(e) => setGoalData({ ...goalData, steps: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Active Mins Target</label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? goalData.activeMinutes : goals.activeMinutes}
                  onChange={(e) => setGoalData({ ...goalData, activeMinutes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Water Goal (ml)</label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? goalData.water : goals.water}
                  onChange={(e) => setGoalData({ ...goalData, water: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-2">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Early Bird", "7 Day Streak", "Marathoner", "Healthy Eater"].map((badge, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 border rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  <Award className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-xs font-medium text-center">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2 border-t pt-6">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
            <CardDescription>Free Tier</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Upgrade to Pro</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sync</CardTitle>
            <CardDescription>Connect Devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="w-full">G</Button>
              <Button variant="outline" size="icon" className="w-full"></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>App preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <SettingsIcon className="h-4 w-4" /> Config
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}