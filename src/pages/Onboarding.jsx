import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dumbbell, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
    const { setUser } = useAppContext();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        goal: 'Lose Weight',
        weight: '',
        height: '',
        age: '',
        gender: 'Male'
    });

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else finish();
    };

    const finish = async () => {
        await setUser(formData);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-primary/20 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Welcome to FitTrack</CardTitle>
                    <CardDescription>Let's personalize your experience.</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">What's your name?</label>
                                <Input
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">What is your main goal?</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                >
                                    <option>Lose Weight</option>
                                    <option>Build Muscle</option>
                                    <option>Keep Fit</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Age</label>
                                    <Input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Gender</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Weight (kg)</label>
                                    <Input type="number" placeholder="70" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} autoFocus />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Height (cm)</label>
                                    <Input type="number" placeholder="175" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground text-center pt-4">You can update these details anytime in your profile.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                    ) : <div></div>}

                    <Button onClick={nextStep} disabled={!formData.name && step === 1}>
                        {step === 3 ? "Get Started" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
