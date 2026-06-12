import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Pause,
  Play,
  RotateCcw,
  Timer,
  X
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const WARM_UP = [
  ["Neck rolls + shoulder rolls", "45 sec"],
  ["Arm circles, forward and backward", "45 sec"],
  ["Hip circles", "45 sec"],
  ["Bodyweight squats, slow and controlled", "45 sec"],
  ["Glute bridges", "45 sec"],
  ["Shoulder taps", "45 sec"],
  ["Hip flexor stretch", "1 min"],
  ["Easy incline push-ups", "45 sec"],
  ["Light jumping jacks or marching in place", "45 sec"]
];

const MAIN_DAYS = ["Monday", "Wednesday", "Friday"];
const DAYS = ["Monday", "Wednesday", "Friday", "Saturday"];
const MIN_EXERCISES_PER_WORKOUT = 4;
const MAX_EXERCISES_PER_WORKOUT = 6;

function ex({
  name,
  slot,
  category,
  level = "Beginner",
  equipment = "None",
  sets,
  reps,
  rest,
  type,
  target,
  progressionGoal,
  makeHarder,
  nextExercise
}) {
  return {
    name,
    slot,
    category,
    level,
    equipment,
    sets,
    reps,
    rest,
    type,
    target,
    progressionGoal,
    makeHarder,
    nextExercise
  };
}

const EXERCISE_POOLS = {
  pushChest: [
    ex({
      name: "Wall Push-Up",
      slot: "Chest",
      category: "Push",
      equipment: "Wall",
      sets: 3,
      reps: "10 to 15",
      rest: 45,
      type: "pushup",
      target: "Chest, triceps, shoulders",
      progressionGoal: "Complete 3 sets of 15 reps with good form",
      makeHarder: "Move to incline push-ups",
      nextExercise: "Incline Push-Up"
    }),
    ex({
      name: "Incline Push-Up",
      slot: "Chest",
      category: "Push",
      equipment: "Chair or desk",
      sets: 3,
      reps: "6 to 12",
      rest: 60,
      type: "pushup",
      target: "Chest, shoulders, triceps",
      progressionGoal: "Complete 3 sets of 12 reps with good form",
      makeHarder: "Lower the incline",
      nextExercise: "Normal Push-Up"
    }),
    ex({
      name: "Dumbbell Floor Press",
      slot: "Chest",
      category: "Push",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "10 to 15",
      rest: 60,
      type: "floorPress",
      target: "Chest, triceps",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Pause at the bottom",
      nextExercise: "Single-Arm Dumbbell Floor Press"
    }),
    ex({
      name: "Normal Push-Up",
      slot: "Chest",
      category: "Push",
      level: "Intermediate",
      sets: 3,
      reps: "6 to 15",
      rest: 75,
      type: "pushup",
      target: "Chest, shoulders, triceps",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Slow 3 second lowering",
      nextExercise: "Slow Push-Up"
    })
  ],

  pushShoulder: [
    ex({
      name: "Dumbbell Overhead Press",
      slot: "Shoulder",
      category: "Shoulders",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "8 to 12",
      rest: 60,
      type: "press",
      target: "Shoulders, triceps, core",
      progressionGoal: "Complete 3 sets of 12 reps",
      makeHarder: "Slow the lowering phase",
      nextExercise: "Slow Dumbbell Press"
    }),
    ex({
      name: "Dumbbell Lateral Raise",
      slot: "Shoulder",
      category: "Shoulders",
      equipment: "5kg dumbbells",
      sets: 2,
      reps: "10 to 15",
      rest: 45,
      type: "lateralRaise",
      target: "Side delts",
      progressionGoal: "Complete 2 sets of 15 reps",
      makeHarder: "Hold top for 1 second",
      nextExercise: "Lateral Raise Hold"
    }),
    ex({
      name: "Dumbbell Front Raise",
      slot: "Shoulder",
      category: "Shoulders",
      equipment: "5kg dumbbells",
      sets: 2,
      reps: "10 to 15",
      rest: 45,
      type: "lateralRaise",
      target: "Front delts",
      progressionGoal: "Complete 2 sets of 15 reps",
      makeHarder: "Slow the lowering phase",
      nextExercise: "Slow Dumbbell Press"
    }),
    ex({
      name: "Pike Push-Up",
      slot: "Shoulder",
      category: "Shoulders",
      level: "Intermediate",
      sets: 3,
      reps: "5 to 10",
      rest: 75,
      type: "pushup",
      target: "Shoulders, triceps",
      progressionGoal: "Complete 3 sets of 10 reps",
      makeHarder: "Increase hip height",
      nextExercise: "Wall Walk Hold"
    })
  ],

  pushTriceps: [
    ex({
      name: "Dumbbell Triceps Extension",
      slot: "Triceps",
      category: "Arms",
      equipment: "1 dumbbell",
      sets: 2,
      reps: "10 to 15",
      rest: 45,
      type: "press",
      target: "Triceps",
      progressionGoal: "Complete 2 sets of 15 reps",
      makeHarder: "Slow the stretch at the bottom",
      nextExercise: "Overhead Triceps Extension"
    }),
    ex({
      name: "Close-Grip Incline Push-Up",
      slot: "Triceps",
      category: "Push",
      equipment: "Chair or desk",
      sets: 3,
      reps: "6 to 12",
      rest: 60,
      type: "pushup",
      target: "Triceps, chest",
      progressionGoal: "Complete 3 sets of 12 reps",
      makeHarder: "Lower the incline",
      nextExercise: "Close-Grip Push-Up"
    }),
    ex({
      name: "Dumbbell Kickback",
      slot: "Triceps",
      category: "Arms",
      equipment: "5kg dumbbells",
      sets: 2,
      reps: "12 to 15",
      rest: 45,
      type: "reverseFly",
      target: "Triceps",
      progressionGoal: "Complete 2 sets of 15 reps",
      makeHarder: "Pause at the top",
      nextExercise: "Overhead Triceps Extension"
    })
  ],

  pullRow: [
    ex({
      name: "One-Arm Dumbbell Row",
      slot: "Row",
      category: "Pull",
      equipment: "5kg dumbbell",
      sets: 3,
      reps: "10 to 15 each side",
      rest: 60,
      type: "row",
      target: "Back, lats, biceps",
      progressionGoal: "Complete 3 sets of 15 reps each side",
      makeHarder: "3 second lowering",
      nextExercise: "Slow One-Arm Row"
    }),
    ex({
      name: "Two-Dumbbell Bent Row",
      slot: "Row",
      category: "Pull",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "10 to 15",
      rest: 60,
      type: "row",
      target: "Back, rear delts",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Pause at the top",
      nextExercise: "Slow One-Arm Row"
    }),
    ex({
      name: "Table Row",
      slot: "Row",
      category: "Pull",
      equipment: "Stable table",
      sets: 3,
      reps: "5 to 10",
      rest: 75,
      type: "bodyRow",
      target: "Back, biceps",
      progressionGoal: "Complete 3 sets of 10 reps",
      makeHarder: "Move feet forward",
      nextExercise: "Feet-Forward Table Row"
    })
  ],

  pullBack: [
    ex({
      name: "Dumbbell Reverse Fly",
      slot: "Back",
      category: "Pull",
      equipment: "5kg dumbbells",
      sets: 2,
      reps: "12 to 15",
      rest: 45,
      type: "reverseFly",
      target: "Rear delts, upper back",
      progressionGoal: "Complete 2 sets of 15 reps",
      makeHarder: "Pause at the top",
      nextExercise: "Rear Delt Fly With Pause"
    }),
    ex({
      name: "Dumbbell Shrugs",
      slot: "Back",
      category: "Pull",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "12 to 20",
      rest: 45,
      type: "row",
      target: "Traps, upper back",
      progressionGoal: "Complete 3 sets of 20 reps",
      makeHarder: "Hold top for 2 seconds",
      nextExercise: "Weighted Shrugs"
    }),
    ex({
      name: "Dumbbell Pullover",
      slot: "Back",
      category: "Pull",
      level: "Intermediate",
      equipment: "Dumbbell",
      sets: 3,
      reps: "10 to 15",
      rest: 60,
      type: "floorPress",
      target: "Lats, chest, core",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Slow controlled reps",
      nextExercise: "Dumbbell Pullover With Pause"
    })
  ],

  biceps: [
    ex({
      name: "Dumbbell Bicep Curl",
      slot: "Biceps",
      category: "Arms",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "10 to 15",
      rest: 45,
      type: "curl",
      target: "Biceps",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Slow the lowering phase",
      nextExercise: "Zottman Curl"
    }),
    ex({
      name: "Hammer Curl",
      slot: "Biceps",
      category: "Arms",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "10 to 15",
      rest: 45,
      type: "curl",
      target: "Biceps, forearms",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Pause at top",
      nextExercise: "Cross-Body Hammer Curl"
    }),
    ex({
      name: "Zottman Curl",
      slot: "Biceps",
      category: "Arms",
      level: "Intermediate",
      equipment: "Dumbbells",
      sets: 2,
      reps: "8 to 12",
      rest: 45,
      type: "curl",
      target: "Biceps, forearms",
      progressionGoal: "Complete 2 sets of 12 reps",
      makeHarder: "Slow lowering",
      nextExercise: "Curl 21s"
    })
  ],

  legsSquat: [
    ex({
      name: "Bodyweight Squat",
      slot: "Squat",
      category: "Legs",
      sets: 3,
      reps: "10 to 15",
      rest: 60,
      type: "squat",
      target: "Quads, glutes",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Move to goblet squat",
      nextExercise: "Dumbbell Goblet Squat"
    }),
    ex({
      name: "Chair Squat",
      slot: "Squat",
      category: "Legs",
      equipment: "Chair",
      sets: 3,
      reps: "8 to 12",
      rest: 60,
      type: "squat",
      target: "Quads, glutes",
      progressionGoal: "Complete 3 sets of 12 reps",
      makeHarder: "Use lower chair",
      nextExercise: "Bodyweight Squat"
    }),
    ex({
      name: "Dumbbell Goblet Squat",
      slot: "Squat",
      category: "Legs",
      equipment: "5kg dumbbell",
      sets: 3,
      reps: "10 to 15",
      rest: 60,
      type: "squat",
      target: "Quads, glutes, core",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Slow the lowering phase",
      nextExercise: "Goblet Squat with Pause"
    })
  ],

  legsHinge: [
    ex({
      name: "Dumbbell Romanian Deadlift",
      slot: "Hinge",
      category: "Legs",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "10 to 15",
      rest: 60,
      type: "rdl",
      target: "Hamstrings, glutes, back",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Slow tempo",
      nextExercise: "Single-Leg Romanian Deadlift"
    }),
    ex({
      name: "Dumbbell Deadlift",
      slot: "Hinge",
      category: "Full Body",
      equipment: "Dumbbells",
      sets: 3,
      reps: "10 to 15",
      rest: 60,
      type: "rdl",
      target: "Glutes, hamstrings, back",
      progressionGoal: "Complete 3 sets of 15 reps",
      makeHarder: "Slow the lowering phase",
      nextExercise: "Dumbbell Romanian Deadlift"
    }),
    ex({
      name: "Single-Leg Romanian Deadlift",
      slot: "Hinge",
      category: "Legs",
      level: "Intermediate",
      equipment: "Dumbbells",
      sets: 3,
      reps: "8 to 12 each leg",
      rest: 60,
      type: "rdl",
      target: "Hamstrings, glutes, balance",
      progressionGoal: "Complete 3 sets of 12 each leg",
      makeHarder: "Slow tempo",
      nextExercise: "Single-Leg RDL With Pause"
    })
  ],

  singleLeg: [
    ex({
      name: "Reverse Lunge",
      slot: "Single-leg",
      category: "Legs",
      sets: 2,
      reps: "6 to 10 each leg",
      rest: 60,
      type: "lunge",
      target: "Quads, glutes",
      progressionGoal: "Complete 2 sets of 10 each leg",
      makeHarder: "Hold dumbbells",
      nextExercise: "Dumbbell Split Squat"
    }),
    ex({
      name: "Step-Ups",
      slot: "Single-leg",
      category: "Legs",
      level: "Intermediate",
      equipment: "Chair or step",
      sets: 3,
      reps: "8 to 12 each leg",
      rest: 60,
      type: "stepUp",
      target: "Quads, glutes",
      progressionGoal: "Complete 3 sets of 12 each leg",
      makeHarder: "Hold dumbbells",
      nextExercise: "Bulgarian Split Squat"
    }),
    ex({
      name: "Dumbbell Split Squat",
      slot: "Single-leg",
      category: "Legs",
      level: "Intermediate",
      equipment: "5kg dumbbells",
      sets: 3,
      reps: "8 to 12 each leg",
      rest: 60,
      type: "lunge",
      target: "Quads, glutes",
      progressionGoal: "Complete 3 sets of 12 each leg",
      makeHarder: "Slow 3 second lowering",
      nextExercise: "Bulgarian Split Squat"
    })
  ],

  calvesGlutes: [
    ex({
      name: "Glute Bridge",
      slot: "Calves/glutes",
      category: "Legs",
      sets: 3,
      reps: "12 to 20",
      rest: 45,
      type: "gluteBridge",
      target: "Glutes, hamstrings",
      progressionGoal: "Complete 3 sets of 20 reps",
      makeHarder: "Single-leg glute bridge",
      nextExercise: "Single-Leg Glute Bridge"
    }),
    ex({
      name: "Calf Raise",
      slot: "Calves/glutes",
      category: "Legs",
      sets: 3,
      reps: "15 to 25",
      rest: 45,
      type: "calfRaise",
      target: "Calves",
      progressionGoal: "Complete 3 sets of 25 reps",
      makeHarder: "Hold dumbbells",
      nextExercise: "Weighted Calf Raise"
    }),
    ex({
      name: "Wall Sit",
      slot: "Calves/glutes",
      category: "Legs",
      equipment: "Wall",
      sets: 2,
      reps: "30 to 45 sec",
      rest: 60,
      type: "squat",
      target: "Quads, glutes",
      progressionGoal: "Hold 2 sets of 45 seconds",
      makeHarder: "Hold dumbbell",
      nextExercise: "Goblet Squat with Pause"
    })
  ],

  fullBody: [
    ex({
      name: "Squat to Press",
      slot: "Full Body",
      category: "Full Body",
      equipment: "Dumbbells",
      sets: 3,
      reps: "8 to 12",
      rest: 75,
      type: "press",
      target: "Legs, shoulders, core",
      progressionGoal: "Complete 3 sets of 12 reps",
      makeHarder: "Slow the squat and press strongly",
      nextExercise: "Dumbbell Thruster"
    }),
    ex({
      name: "Push-Up to Shoulder Tap",
      slot: "Full Body",
      category: "Full Body",
      sets: 3,
      reps: "6 to 10",
      rest: 60,
      type: "pushup",
      target: "Chest, shoulders, core",
      progressionGoal: "Complete 3 sets of 10 reps",
      makeHarder: "Reduce hip movement",
      nextExercise: "Push-Up to Row Motion"
    }),
    ex({
      name: "Farmer’s Carry",
      slot: "Full Body",
      category: "Full Body",
      equipment: "Dumbbells",
      sets: 3,
      reps: "30 to 60 sec",
      rest: 45,
      type: "curl",
      target: "Grip, traps, core",
      progressionGoal: "Hold 3 sets of 60 seconds",
      makeHarder: "Walk slower or add books",
      nextExercise: "Suitcase Carry"
    }),
    ex({
      name: "Dumbbell Row to RDL",
      slot: "Full Body",
      category: "Full Body",
      equipment: "Dumbbells",
      sets: 3,
      reps: "8 to 12",
      rest: 75,
      type: "rdl",
      target: "Back, hamstrings, glutes",
      progressionGoal: "Complete 3 sets of 12 reps",
      makeHarder: "Slow everything down",
      nextExercise: "Dumbbell Clean to Press"
    }),
    ex({
      name: "Burpee Without Jump",
      slot: "Full Body",
      category: "Full Body",
      level: "Intermediate",
      sets: 3,
      reps: "6 to 10",
      rest: 75,
      type: "pushup",
      target: "Full body, core, chest",
      progressionGoal: "Complete 3 sets of 10 reps",
      makeHarder: "Add push-up",
      nextExercise: "Burpee With Push-Up"
    }),
    ex({
      name: "Squat, Curl, Press",
      slot: "Full Body",
      category: "Full Body",
      level: "Intermediate",
      equipment: "Dumbbells",
      sets: 3,
      reps: "8 to 12",
      rest: 75,
      type: "press",
      target: "Legs, biceps, shoulders",
      progressionGoal: "Complete 3 sets of 12 reps",
      makeHarder: "Slow everything",
      nextExercise: "Dumbbell Clean to Press"
    })
  ]
};

const DAY_CONFIG = {
  Monday: {
    title: "Push Day",
    focus: "Random push exercises from the push library",
    poolKeys: ["pushChest", "pushShoulder", "pushTriceps"]
  },
  Wednesday: {
    title: "Pull Day",
    focus: "Random pull exercises from the pull library",
    poolKeys: ["pullRow", "pullBack", "biceps"]
  },
  Friday: {
    title: "Leg Day",
    focus: "Random leg exercises from the leg library",
    poolKeys: ["legsSquat", "legsHinge", "singleLeg", "calvesGlutes"]
  },
  Saturday: {
    title: "Optional Full Body",
    focus: "Random full-body exercises from the full-body library. Only do this if you feel good",
    poolKeys: ["fullBody"]
  }
};

const DEMO_TEXT = {
  pushup: "Lower under control, pause briefly, then push back up.",
  squat: "Sit down slowly, keep your chest tall, then stand up.",
  floorPress: "Press the dumbbells up, then lower with control.",
  lunge: "Step back, lower gently, then drive through the front foot.",
  press: "Press from shoulders to overhead without leaning back.",
  row: "Pull your elbow toward your hip and lower slowly.",
  bodyRow: "Pull your chest toward the table or bedsheet.",
  curl: "Keep elbows still and curl the dumbbells up.",
  rdl: "Hinge hips back, keep back flat, then stand tall.",
  plank: "Hold a straight line and brace your core.",
  gluteBridge: "Lift your hips and squeeze your glutes at the top.",
  deadBug: "Move opposite arm and leg while your back stays controlled.",
  stepUp: "Step up smoothly and lower slowly.",
  reverseFly: "Open arms wide and squeeze your upper back.",
  calfRaise: "Rise onto your toes and lower slowly.",
  lateralRaise: "Raise dumbbells to shoulder height and lower slowly."
};

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekStartKey(date = new Date()) {
  const working = new Date(date);
  working.setHours(0, 0, 0, 0);
  const day = working.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  working.setDate(working.getDate() + diff);
  return localDateKey(working);
}

function getRecommendedDay(date = new Date()) {
  const day = date.getDay();
  if (day === 1) return "Monday";
  if (day === 2 || day === 3) return "Wednesday";
  if (day === 4 || day === 5) return "Friday";
  if (day === 6) return "Saturday";
  return "Monday";
}

function hashStringToSeed(input) {
  let hash = 1779033703 ^ input.length;

  for (let i = 0; i < input.length; i += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function createSeededRandom(seedText) {
  const seed = hashStringToSeed(seedText)();
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cloneExercise(exercise) {
  return { ...exercise };
}

function pickUnique(pool, random, usedNames) {
  const options = pool.filter((item) => !usedNames.has(item.name));
  const usable = options.length ? options : pool;
  const picked = usable[Math.floor(random() * usable.length) % usable.length];

  usedNames.add(picked.name);
  return cloneExercise(picked);
}

function buildDayPlan(day, random) {
  const config = DAY_CONFIG[day];
  const usedNames = new Set();
  const library = config.poolKeys.flatMap(
    (poolKey) => EXERCISE_POOLS[poolKey] || []
  );

  const exerciseCount =
    MIN_EXERCISES_PER_WORKOUT +
    Math.floor(
      random() *
        (MAX_EXERCISES_PER_WORKOUT - MIN_EXERCISES_PER_WORKOUT + 1)
    );

  const exercises = [];

  while (exercises.length < exerciseCount && exercises.length < library.length) {
    exercises.push(pickUnique(library, random, usedNames));
  }

  return {
    title: config.title,
    focus: `${config.focus}. ${exercises.length} exercises chosen for this session.`,
    exercises
  };
}

function buildWeeklyPlan(weekStartKey, userSeed = "ezra") {
  const random = createSeededRandom(`${weekStartKey}-${userSeed}`);

  return {
    id: `weekly-${weekStartKey}`,
    name: "Monday Shuffle",
    title: "Random workouts built this Monday",
    weekStart: weekStartKey,
    generatedAt: new Date().toISOString(),
    days: DAYS.reduce((days, day) => {
      days[day] = buildDayPlan(day, random);
      return days;
    }, {})
  };
}

function getDayPlan(weeklyPlan, day) {
  return weeklyPlan?.days?.[day] || buildWeeklyPlan(getWeekStartKey()).days[day];
}

function getExerciseKey(weekStartKey, day, index) {
  return `${weekStartKey}-${day}-${index}`;
}

function getDayProgress(weeklyPlan, day, completed) {
  const exercises = getDayPlan(weeklyPlan, day).exercises;
  const done = exercises.filter((_, index) =>
    completed[getExerciseKey(weeklyPlan.weekStart, day, index)]
  ).length;

  return Math.round((done / exercises.length) * 100);
}

function getWeekProgress(weeklyPlan, completed) {
  const keys = MAIN_DAYS.flatMap((day) =>
    getDayPlan(weeklyPlan, day).exercises.map((_, index) =>
      getExerciseKey(weeklyPlan.weekStart, day, index)
    )
  );

  const done = keys.filter((key) => completed[key]).length;

  return Math.round((done / keys.length) * 100);
}

function isMainWeekComplete(weeklyPlan, completed) {
  return MAIN_DAYS.every(
    (day) => getDayProgress(weeklyPlan, day, completed) === 100
  );
}

function getTotalSets(dayPlan) {
  return dayPlan.exercises.reduce((total, item) => total + item.sets, 0);
}

function getWorkoutLengthLabel(dayPlan) {
  if (dayPlan.exercises.length === MIN_EXERCISES_PER_WORKOUT) {
    return "Minimum session";
  }

  if (dayPlan.exercises.length === MAX_EXERCISES_PER_WORKOUT) {
    return "Maximum session";
  }

  return "Ideal session";
}

function getExerciseTimerSeconds(exercise) {
  const reps = String(exercise?.reps || "").toLowerCase();

  if (reps.includes("min")) {
    const numbers = reps.match(/\d+/g)?.map(Number) || [];
    return numbers.length ? Math.max(...numbers) * 60 : 60;
  }

  if (reps.includes("sec")) {
    const numbers = reps.match(/\d+/g)?.map(Number) || [];
    return numbers.length ? Math.max(...numbers) : 30;
  }

  if (exercise?.type === "plank") return 45;

  return 0;
}

function getDetails(exercise) {
  const shared = {
    description:
      "Move slowly, control the lowering phase, and stop if anything feels sharp or painful.",
    steps: [
      "Set your starting position.",
      "Brace your core.",
      "Move with control.",
      "Reset before the next rep."
    ],
    avoid: "Do not rush or use painful range of motion."
  };

  const details = {
    pushup: [
      "Keep your body straight and lower your chest under control.",
      ["Hands slightly wider than shoulders.", "Brace abs and glutes.", "Lower slowly.", "Push back up."],
      "Do not let your hips sag."
    ],
    squat: [
      "Squat with control while keeping your chest tall.",
      ["Feet around shoulder width.", "Keep your chest tall.", "Sit down slowly.", "Stand tall."],
      "Do not force painful depth."
    ],
    floorPress: [
      "Press dumbbells from the floor and lower them slowly.",
      ["Lie on your back.", "Start with elbows on the floor.", "Press up.", "Lower with control."],
      "Do not bounce your elbows."
    ],
    row: [
      "Pull toward your hip while keeping your back flat.",
      ["Hinge forward.", "Keep back flat.", "Pull elbow toward hip.", "Lower slowly."],
      "Do not twist your body."
    ],
    rdl: [
      "Hinge your hips backward, then squeeze your glutes to stand.",
      ["Hold dumbbells in front.", "Bend knees slightly.", "Push hips back.", "Stand tall."],
      "Do not round your back."
    ],
    plank: [
      "Hold a straight line while bracing abs and glutes.",
      ["Elbows under shoulders.", "Straight body.", "Squeeze abs and glutes.", "Breathe steadily."],
      "Do not let hips drop."
    ],
    press: [
      "Press overhead or extend with your core tight.",
      ["Start controlled.", "Brace core.", "Press smoothly.", "Lower slowly."],
      "Do not lean back."
    ],
    curl: [
      "Curl or carry without swinging your body.",
      ["Stand tall.", "Keep shoulders controlled.", "Move smoothly.", "Lower with control."],
      "Do not swing."
    ],
    gluteBridge: [
      "Lift your hips by squeezing your glutes.",
      ["Lie with knees bent.", "Keep feet flat.", "Lift hips.", "Lower slowly."],
      "Do not over-arch your back."
    ],
    lunge: [
      "Step back and lower gently with control.",
      ["Stand tall.", "Step backward.", "Lower under control.", "Drive through the front foot."],
      "Do not let your knee collapse inward."
    ],
    stepUp: [
      "Step up smoothly and lower slowly.",
      ["Place one foot on the step.", "Drive through that foot.", "Stand tall.", "Lower slowly."],
      "Do not jump off the step."
    ],
    reverseFly: [
      "Open arms wide and squeeze your upper back.",
      ["Hinge slightly.", "Keep arms controlled.", "Open wide.", "Lower slowly."],
      "Do not shrug your shoulders."
    ],
    calfRaise: [
      "Rise onto your toes and lower slowly.",
      ["Stand tall.", "Lift heels.", "Pause at the top.", "Lower slowly."],
      "Do not bounce."
    ],
    lateralRaise: [
      "Raise dumbbells to shoulder height and lower slowly.",
      ["Stand tall.", "Keep elbows slightly bent.", "Raise to shoulder height.", "Lower slowly."],
      "Do not swing the weights."
    ]
  };

  const chosen = details[exercise.type] || shared;

  if (Array.isArray(chosen)) {
    return {
      description: chosen[0],
      steps: chosen[1],
      avoid: chosen[2]
    };
  }

  return chosen;
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function SetTracker({ totalSets, currentSet, resting }) {
  const completedSets = Math.max(0, currentSet - 1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-black text-white">Set progress</p>
        <p className="text-sm text-slate-400">
          {completedSets} of {totalSets} completed
        </p>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${totalSets}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: totalSets }, (_, index) => {
          const set = index + 1;
          const done = set < currentSet;
          const active = set === currentSet && !resting;

          return (
            <div
              key={set}
              className={`rounded-2xl border p-3 text-center text-sm font-black ${
                done
                  ? "border-emerald-400 bg-emerald-400 text-slate-950"
                  : active
                    ? "border-white bg-white text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              {done ? "Done" : `Set ${set}`}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseInstructions({ exercise }) {
  const details = getDetails(exercise);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-xl font-black text-white">How to do it</h3>
      <p className="mt-2 text-slate-300">{details.description}</p>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.04] p-3">
          <span className="font-bold text-white">Target:</span>{" "}
          {exercise.target}
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-3">
          <span className="font-bold text-white">Level:</span>{" "}
          {exercise.level}
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-3">
          <span className="font-bold text-white">Progression:</span>{" "}
          {exercise.progressionGoal}
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-3">
          <span className="font-bold text-white">Make harder:</span>{" "}
          {exercise.makeHarder}
        </div>
      </div>

      <ol className="mt-4 space-y-2 text-sm text-slate-300">
        {details.steps.map((step, index) => (
          <li key={`${exercise.name}-${step}`} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
        Avoid: {details.avoid}
      </div>
    </div>
  );
}

function WarmUpCard() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-5">
      <h3 className="font-black text-white">6-Minute Warm-Up</h3>
      <p className="mt-1 text-sm text-slate-400">
        Do this before every workout. Keep movement controlled and pain-free.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {WARM_UP.map(([movement, time]) => (
          <div
            key={movement}
            className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 text-sm"
          >
            <span className="font-bold text-slate-200">{movement}</span>
            <span className="text-slate-400">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniAnimation({ type, playing }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
      <div className="flex h-[320px] flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-center md:h-[420px]">
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 ${
            playing ? "animate-pulse" : ""
          }`}
        >
          <Dumbbell className="text-emerald-400" size={54} />
        </div>

        <h3 className="mt-6 text-2xl font-black text-white">
          {type?.toUpperCase() || "EXERCISE"}
        </h3>

        <p className="mt-3 max-w-sm text-sm font-bold text-slate-300">
          {DEMO_TEXT[type] || "Move slowly and stay controlled."}
        </p>
      </div>
    </div>
  );
}

function ExerciseTimerCard({
  totalSeconds,
  leftSeconds,
  isRunning,
  onStart,
  onReset
}) {
  if (!totalSeconds) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="font-black text-white">Exercise timer</h3>
        <p className="mt-2 text-sm text-slate-400">
          This exercise is rep-based, so no timer is needed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-white">Exercise timer</h3>
        <Timer size={18} className="text-emerald-400" />
      </div>

      <div className="mt-4 text-5xl font-black text-white">
        {formatTime(leftSeconds)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onStart}
          className="rounded-2xl bg-emerald-400 px-4 py-3 font-black text-slate-950"
        >
          {isRunning ? "Restart" : "Start"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl bg-white/10 px-4 py-3 font-black text-white hover:bg-white/20"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function WorkoutOverview({ weeklyPlan, day, plan, progress, completed }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-semibold text-emerald-400">{weeklyPlan.title}</p>
          <h2 className="text-3xl font-black">
            {day}: {plan.title}
          </h2>
          <p className="mt-1 text-slate-300">{plan.focus}</p>
          <p className="mt-2 text-sm text-slate-500">
            Built for week starting {weeklyPlan.weekStart}. New shuffle every
            Monday.
          </p>
        </div>

        <div className="text-sm text-slate-400">
          {plan.exercises.length} exercises • {getWorkoutLengthLabel(plan)} •{" "}
          {getTotalSets(plan)} sets • about 20 to 25 min
        </div>
      </div>

      <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {plan.exercises.map((item, index) => {
          const done =
            completed[getExerciseKey(weeklyPlan.weekStart, day, index)];

          return (
            <div
              key={`${day}-${item.name}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${
                    done
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {done ? <CheckCircle2 size={18} /> : index + 1}
                </div>

                <div>
                  <div className="mb-1 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-bold text-emerald-200">
                      {item.slot}
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-slate-300">
                      {item.level}
                    </span>
                  </div>

                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-slate-400">
                    {item.sets} sets × {item.reps} • Rest {item.rest}s •{" "}
                    {item.equipment}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayPicker({ selectedDay, weeklyPlan, completed, onChooseDay }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-4">
      <div className="mb-3 flex items-center gap-2 font-black">
        <CalendarDays size={18} /> Training Days
      </div>

      <div className="space-y-2">
        {DAYS.map((day) => {
          const dayProgress = getDayProgress(weeklyPlan, day, completed);
          const active = selectedDay === day;
          const plan = getDayPlan(weeklyPlan, day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => onChooseDay(day)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-emerald-400 bg-emerald-400 text-slate-950"
                  : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black">
                    {day}
                    {day === "Saturday" ? " Optional" : ""}
                  </p>
                  <p
                    className={`text-sm ${
                      active ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {plan.title}
                  </p>
                </div>

                <span className="text-sm font-black">{dayProgress}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WorkoutSession({
  weeklyPlan,
  day,
  exercise,
  exerciseIndex,
  totalExercises,
  setNumber,
  resting,
  restLeft,
  restInfo,
  isPlaying,
  exerciseTimerTotal,
  exerciseTimerLeft,
  exerciseTimerRunning,
  wakeStatus,
  onExit,
  onTogglePlay,
  onCompleteSet,
  onSkipRest,
  onBack,
  onNext,
  onStartExerciseTimer,
  onResetExerciseTimer
}) {
  return (
    <main className="rounded-[2rem] border border-white/10 bg-slate-900 p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-emerald-400">
            {weeklyPlan.name} • {day} • Exercise {exerciseIndex + 1} of{" "}
            {totalExercises}
          </p>

          <h2 className="text-2xl font-black md:text-4xl">{exercise.name}</h2>

          <p className="mt-1 text-slate-300">
            Set {setNumber} of {exercise.sets} • Target: {exercise.reps}
          </p>

          <p className="mt-2 text-xs font-bold text-slate-500">
            {wakeStatus}
          </p>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="rounded-2xl bg-white/10 p-3 hover:bg-white/20"
        >
          <X size={20} />
        </button>
      </div>

      {resting ? (
        <div className="space-y-4">
          <div className="rounded-[2rem] bg-emerald-400 p-8 text-center text-slate-950">
            <div className="flex items-center justify-center gap-2 text-xl font-black">
              <Timer /> Rest
            </div>

            <p className="mt-2 font-bold">
              {restInfo?.completed || "Set complete"}
            </p>

            <div className="mt-3 text-7xl font-black">
              {formatTime(restLeft)}
            </div>

            <p className="mt-2 font-bold">{restInfo?.next || "Next set"}</p>

            <button
              type="button"
              onClick={onSkipRest}
              className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white"
            >
              Skip Rest
            </button>
          </div>

          <SetTracker
            totalSets={exercise.sets}
            currentSet={setNumber}
            resting={resting}
          />

          <ExerciseInstructions exercise={exercise} />
        </div>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <MiniAnimation type={exercise.type} playing={isPlaying} />

            <div className="space-y-4">
              <SetTracker
                totalSets={exercise.sets}
                currentSet={setNumber}
                resting={resting}
              />

              <ExerciseTimerCard
                totalSeconds={exerciseTimerTotal}
                leftSeconds={exerciseTimerLeft}
                isRunning={exerciseTimerRunning}
                onStart={onStartExerciseTimer}
                onReset={onResetExerciseTimer}
              />

              <ExerciseInstructions exercise={exercise} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={onTogglePlay}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-4 font-black hover:bg-white/20"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? "Pause demo" : "Play demo"}
            </button>

            <button
              type="button"
              onClick={onCompleteSet}
              className="rounded-2xl bg-emerald-400 p-4 font-black text-slate-950"
            >
              Complete set
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={exerciseIndex === 0}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-4 font-bold text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} /> Back
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={exerciseIndex >= totalExercises - 1}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-4 font-bold text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default function HomePage() {
  const wakeLockRef = useRef(null);

  const [weeklyPlan, setWeeklyPlan] = useState(() =>
    buildWeeklyPlan(getWeekStartKey(), "initial")
  );
  const [selectedDay, setSelectedDay] = useState(getRecommendedDay());
  const [started, setStarted] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(0);
  const [restEndAt, setRestEndAt] = useState(null);
  const [completed, setCompleted] = useState({});
  const [restInfo, setRestInfo] = useState(null);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Loading progress.");
  const [exerciseTimerEndAt, setExerciseTimerEndAt] = useState(null);
  const [exerciseTimerLeft, setExerciseTimerLeft] = useState(0);
  const [wakeStatus, setWakeStatus] = useState("Screen wake lock ready.");

  const dayPlan = getDayPlan(weeklyPlan, selectedDay);
  const exercise = dayPlan.exercises[exerciseIndex] || dayPlan.exercises[0];
  const exerciseTimerTotal = getExerciseTimerSeconds(exercise);
  const exerciseTimerRunning = Boolean(
    exerciseTimerEndAt && exerciseTimerLeft > 0
  );
  const progress = getDayProgress(weeklyPlan, selectedDay, completed);

  const currentWeekProgress = useMemo(
    () => getWeekProgress(weeklyPlan, completed),
    [weeklyPlan, completed]
  );

  const nextShuffleDate = useMemo(() => {
    const [year, month, day] = weeklyPlan.weekStart.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 7);
    return localDateKey(date);
  }, [weeklyPlan.weekStart]);

  async function loadProgress() {
    if (!supabase) {
      setProgressLoaded(true);
      setSyncStatus("Supabase not connected. Progress is local only.");
      return;
    }

    setSyncStatus("Loading progress.");

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSyncStatus("Could not load user.");
      setProgressLoaded(true);
      return;
    }

    const { data, error } = await supabase
      .from("workout_progress")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setSyncStatus("Could not load saved progress. Check Supabase table/RLS.");
      setProgressLoaded(true);
      return;
    }

    const currentWeekStart = getWeekStartKey();
    const saved = data?.data || {};
    const savedPlan = saved.weeklyPlan;
    const hasCurrentPlan =
      savedPlan?.weekStart === currentWeekStart && savedPlan?.days;

    const activePlan = hasCurrentPlan
      ? savedPlan
      : buildWeeklyPlan(currentWeekStart, user.id);

    const activeCompleted = hasCurrentPlan ? saved.completed || {} : {};
    const session = hasCurrentPlan ? saved.session || {} : {};
    const today = localDateKey();

    setWeeklyPlan(activePlan);
    setCompleted(activeCompleted);

    if (session.date === today && session.started) {
      const sessionDay = DAYS.includes(session.selectedDay)
        ? session.selectedDay
        : getRecommendedDay();

      const sessionPlan = getDayPlan(activePlan, sessionDay);
      const safeExerciseIndex = Math.min(
        Math.max(Number(session.exerciseIndex) || 0, 0),
        sessionPlan.exercises.length - 1
      );
      const safeSetNumber = Math.max(Number(session.setNumber) || 1, 1);

      setSelectedDay(sessionDay);
      setStarted(true);
      setExerciseIndex(safeExerciseIndex);
      setSetNumber(safeSetNumber);
      setResting(Boolean(session.resting));
      setRestEndAt(session.restEndAt || null);
      setRestInfo(session.restInfo || null);
      setExerciseTimerEndAt(session.exerciseTimerEndAt || null);
    } else {
      setSelectedDay(getRecommendedDay());
      resetSessionStateOnly();
    }

    setProgressLoaded(true);
    setSyncStatus(hasCurrentPlan ? "Progress loaded" : "New Monday plan generated");
  }

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    function handleFocus() {
      if (!started && !resting) loadProgress();
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [started, resting]);

  useEffect(() => {
    if (!progressLoaded || !supabase) return undefined;

    setSyncStatus("Saving...");

    const saveTimer = window.setTimeout(async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSyncStatus("Could not save progress.");
        return;
      }

      const { error } = await supabase.from("workout_progress").upsert(
        {
          user_id: user.id,
          data: {
            weeklyPlan,
            completed,
            selectedDay,
            session: {
              date: localDateKey(),
              started,
              selectedDay,
              exerciseIndex,
              setNumber,
              resting,
              restEndAt,
              restInfo,
              exerciseTimerEndAt
            }
          },
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id" }
      );

      setSyncStatus(error ? `Save failed: ${error.message}` : "Saved");
    }, 600);

    return () => window.clearTimeout(saveTimer);
  }, [
    weeklyPlan,
    completed,
    selectedDay,
    started,
    exerciseIndex,
    setNumber,
    resting,
    restEndAt,
    restInfo,
    exerciseTimerEndAt,
    progressLoaded
  ]);

  useEffect(() => {
    if (!resting || !restEndAt) return undefined;

    function tick() {
      const secondsLeft = Math.max(
        0,
        Math.ceil((Number(restEndAt) - Date.now()) / 1000)
      );

      setRestLeft(secondsLeft);

      if (secondsLeft <= 0) {
        setResting(false);
        setRestEndAt(null);
        setIsPlaying(true);
      }
    }

    tick();
    const timerId = window.setInterval(tick, 500);
    return () => window.clearInterval(timerId);
  }, [resting, restEndAt]);

  useEffect(() => {
    if (!exerciseTimerEndAt) {
      setExerciseTimerLeft(exerciseTimerTotal);
      return undefined;
    }

    function tick() {
      const secondsLeft = Math.max(
        0,
        Math.ceil((Number(exerciseTimerEndAt) - Date.now()) / 1000)
      );

      setExerciseTimerLeft(secondsLeft);

      if (secondsLeft <= 0) {
        setExerciseTimerEndAt(null);
      }
    }

    tick();
    const timerId = window.setInterval(tick, 500);
    return () => window.clearInterval(timerId);
  }, [exerciseTimerEndAt, exerciseTimerTotal]);

  useEffect(() => {
    let cancelled = false;

    async function requestWakeLock() {
      if (!started) return;

      if (!("wakeLock" in navigator)) {
        setWakeStatus("Screen wake lock is not supported on this browser.");
        return;
      }

      try {
        if (wakeLockRef.current) return;

        const lock = await navigator.wakeLock.request("screen");

        if (cancelled) {
          await lock.release();
          return;
        }

        wakeLockRef.current = lock;
        setWakeStatus("Screen wake lock active.");

        lock.addEventListener("release", () => {
          wakeLockRef.current = null;
          setWakeStatus("Screen wake lock released.");
        });
      } catch {
        setWakeStatus("Could not keep screen awake. Check browser permissions.");
      }
    }

    async function releaseWakeLock() {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    }

    requestWakeLock();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && started) {
        requestWakeLock();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
    };
  }, [started]);

  function resetSessionStateOnly() {
    setStarted(false);
    setExerciseIndex(0);
    setSetNumber(1);
    setResting(false);
    setRestEndAt(null);
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
    setExerciseTimerEndAt(null);
  }

  function startRest(seconds, info) {
    const restSeconds = Math.max(0, Number(seconds) || 0);
    const endAt = Date.now() + restSeconds * 1000;

    setRestInfo(info);
    setRestEndAt(endAt);
    setRestLeft(restSeconds);
    setResting(true);
    setIsPlaying(false);
    setExerciseTimerEndAt(null);
  }

  function startExerciseTimer() {
    if (!exerciseTimerTotal) return;

    setExerciseTimerLeft(exerciseTimerTotal);
    setExerciseTimerEndAt(Date.now() + exerciseTimerTotal * 1000);
  }

  function resetExerciseTimer() {
    setExerciseTimerEndAt(null);
    setExerciseTimerLeft(exerciseTimerTotal);
  }

  function resetSession() {
    resetSessionStateOnly();
  }

  function chooseDay(day) {
    setSelectedDay(day);
    resetSession();
  }

  function startWorkout() {
    setStarted(true);
    setExerciseIndex(0);
    setSetNumber(1);
    setResting(false);
    setRestEndAt(null);
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
    setExerciseTimerEndAt(null);
  }

  function finishSet() {
    if (setNumber < exercise.sets) {
      const nextSet = setNumber + 1;

      setSetNumber(nextSet);
      startRest(exercise.rest, {
        completed: `Set ${setNumber} of ${exercise.sets} complete`,
        next: `Next: Set ${nextSet} of ${exercise.sets}`
      });

      return;
    }

    const completedKey = getExerciseKey(
      weeklyPlan.weekStart,
      selectedDay,
      exerciseIndex
    );

    const nextCompleted = {
      ...completed,
      [completedKey]: true
    };

    setCompleted(nextCompleted);
    setExerciseTimerEndAt(null);

    if (exerciseIndex < dayPlan.exercises.length - 1) {
      const nextExercise = dayPlan.exercises[exerciseIndex + 1];

      setExerciseIndex((index) => index + 1);
      setSetNumber(1);

      startRest(exercise.rest, {
        completed: `${exercise.name} complete`,
        next: `Next: ${nextExercise.name}`
      });

      return;
    }

    resetSession();
  }

  function goNext() {
    if (exerciseIndex >= dayPlan.exercises.length - 1) return;

    setExerciseIndex((index) => index + 1);
    setSetNumber(1);
    setResting(false);
    setRestEndAt(null);
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
    setExerciseTimerEndAt(null);
  }

  function goBack() {
    if (exerciseIndex <= 0) return;

    setExerciseIndex((index) => index - 1);
    setSetNumber(1);
    setResting(false);
    setRestEndAt(null);
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
    setExerciseTimerEndAt(null);
  }

  function resetProgress() {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your workout progress for this generated plan?"
    );

    if (!confirmReset) return;

    setCompleted({});
    resetSession();
    setSyncStatus("Progress reset.");
  }

  if (!progressLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
        <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-6 text-center">
            <Dumbbell className="mx-auto mb-4 text-emerald-400" size={42} />
            <h1 className="text-2xl font-black">Loading your workout...</h1>
            <p className="mt-2 text-sm text-slate-400">{syncStatus}</p>
          </div>
        </div>
      </div>
    );
  }

  const mainWeekComplete = isMainWeekComplete(weeklyPlan, completed);

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[2rem] border border-white/10 bg-slate-900 p-5 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">
                <Dumbbell size={16} /> Weekly workout coach
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Your workout dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Monday, Wednesday, and Friday are your main training days.
                Saturday is optional. A new workout shuffle is generated every
                Monday.
              </p>

              <p className="mt-2 text-sm text-slate-500">{syncStatus}</p>
            </div>

            <button
              type="button"
              onClick={startWorkout}
              className="rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950"
            >
              Start {selectedDay}
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Week progress" value={`${currentWeekProgress}%`} />
            <Stat label="Current day" value={selectedDay} />
            <Stat label="Next shuffle" value={nextShuffleDate} />
            <Stat
              label="Main week complete"
              value={mainWeekComplete ? "Yes" : "No"}
            />
          </div>
        </header>

        {!started ? (
          <>
            <WarmUpCard />

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              <main className="space-y-6">
                <WorkoutOverview
                  weeklyPlan={weeklyPlan}
                  day={selectedDay}
                  plan={dayPlan}
                  progress={progress}
                  completed={completed}
                />
              </main>

              <aside className="space-y-4">
                <DayPicker
                  selectedDay={selectedDay}
                  weeklyPlan={weeklyPlan}
                  completed={completed}
                  onChooseDay={chooseDay}
                />

                <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-4">
                  <h3 className="font-black">Random workout logic</h3>
                  <p className="mt-3 text-sm text-slate-300">
                    Monday picks 4 to 6 random exercises from Push. Wednesday
                    uses Pull, Friday uses Legs, and Saturday uses Full Body.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetProgress}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 font-bold hover:bg-white/10"
                >
                  <RotateCcw size={18} /> Reset Progress
                </button>
              </aside>
            </section>
          </>
        ) : (
          <WorkoutSession
            weeklyPlan={weeklyPlan}
            day={selectedDay}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            totalExercises={dayPlan.exercises.length}
            setNumber={setNumber}
            resting={resting}
            restLeft={restLeft}
            restInfo={restInfo}
            isPlaying={isPlaying}
            exerciseTimerTotal={exerciseTimerTotal}
            exerciseTimerLeft={exerciseTimerLeft}
            exerciseTimerRunning={exerciseTimerRunning}
            wakeStatus={wakeStatus}
            onExit={resetSession}
            onTogglePlay={() => setIsPlaying((value) => !value)}
            onCompleteSet={finishSet}
            onSkipRest={() => {
              setResting(false);
              setRestEndAt(null);
              setRestLeft(0);
              setIsPlaying(true);
            }}
            onBack={goBack}
            onNext={goNext}
            onStartExerciseTimer={startExerciseTimer}
            onResetExerciseTimer={resetExerciseTimer}
          />
        )}
      </div>
    </div>
  );
}