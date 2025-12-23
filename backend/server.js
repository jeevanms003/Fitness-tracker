import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
// Using a local instance. If you have a cloud URI, replace it here.
const MONGODB_URI = 'mongodb://127.0.0.1:27017/fitness-tracker';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


// --- Schemas ---
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    goal: String,
    weight: Number,
    height: Number,
    age: Number,
    gender: String,
    goals: {
        calories: { type: Number, default: 2500 },
        steps: { type: Number, default: 10000 },
        activeMinutes: { type: Number, default: 60 },
        water: { type: Number, default: 2500 }
    }
});
const User = mongoose.model('User', UserSchema);

const WorkoutSchema = new mongoose.Schema({
    type: String,
    duration: Number,
    calories: Number,
    date: { type: Date, default: Date.now }
});
const Workout = mongoose.model('Workout', WorkoutSchema);

const MealSchema = new mongoose.Schema({
    name: String,
    calories: Number,
    protein: Number,
    date: { type: Date, default: Date.now }
});
const Meal = mongoose.model('Meal', MealSchema);

const DailyStatSchema = new mongoose.Schema({
    date: String, // YYYY-MM-DD
    waterIntake: { type: Number, default: 0 },
    steps: { type: Number, default: 0 }
});
const DailyStat = mongoose.model('DailyStat', DailyStatSchema);


// --- Routes ---

// Get all data for the dashboard (Aggregation for simplicity in this demo)
app.get('/api/data', async (req, res) => {
    try {
        const user = await User.findOne();
        const workouts = await Workout.find().sort({ date: -1 });
        const meals = await Meal.find().sort({ date: -1 });

        const todayStr = new Date().toISOString().split('T')[0];
        const allDailyStats = await DailyStat.find();
        let daily = allDailyStats.find(d => d.date === todayStr);

        const data = {
            user: user || null,
            workouts,
            meals,
            goals: user ? user.goals : {},
            waterIntake: daily ? daily.waterIntake : 0,
            steps: daily ? daily.steps : 0,
            dailyStats: allDailyStats // Send full history
        };
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// User & Onboarding
app.post('/api/user', async (req, res) => {
    // Upsert user (assuming single user for this local app)
    const { name, email, goal, weight, height, age, gender } = req.body;
    let user = await User.findOne();
    if (!user) {
        user = new User(req.body);
    } else {
        Object.assign(user, req.body);
    }
    await user.save();
    res.json(user);
});

app.post('/api/goals', async (req, res) => {
    let user = await User.findOne();
    if (user) {
        user.goals = { ...user.goals, ...req.body };
        await user.save();
        res.json(user.goals);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Workouts
app.post('/api/workouts', async (req, res) => {
    // Auto-calculate steps estimate: approx 150 steps per min of cardio
    const workout = new Workout(req.body);
    await workout.save();

    // Update daily steps if applicable
    const todayStr = new Date().toISOString().split('T')[0];
    let daily = await DailyStat.findOne({ date: todayStr });
    if (!daily) daily = new DailyStat({ date: todayStr });

    // Simple heuristic: 1 min workout ≈ 100 steps
    daily.steps += (workout.duration || 0) * 100;
    await daily.save();

    res.json(workout);
});

app.delete('/api/workouts/:id', async (req, res) => {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Meals
app.post('/api/meals', async (req, res) => {
    const meal = new Meal(req.body);
    await meal.save();
    res.json(meal);
});

app.delete('/api/meals/:id', async (req, res) => {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Water & Steps (Manual or Updates)
// Water & Steps (Manual or Updates)
app.post('/api/water', async (req, res) => {
    const { amount, date } = req.body;
    const targetDateStr = date ? date : new Date().toISOString().split('T')[0];

    let daily = await DailyStat.findOne({ date: targetDateStr });
    if (!daily) daily = new DailyStat({ date: targetDateStr });

    daily.waterIntake = amount;
    await daily.save();
    res.json({ waterIntake: daily.waterIntake, date: targetDateStr });
});

app.post('/api/steps', async (req, res) => {
    const { steps, date } = req.body;
    const targetDateStr = date ? date : new Date().toISOString().split('T')[0];

    let daily = await DailyStat.findOne({ date: targetDateStr });
    if (!daily) daily = new DailyStat({ date: targetDateStr });

    daily.steps = steps;
    await daily.save();
    res.json({ steps: daily.steps, date: targetDateStr });
});

app.get('/api/chart-data', async (req, res) => {
    // Aggregate last 7 days calories
    // Logic omitted for brevity, returning mock for chart specifically
    res.json([]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
