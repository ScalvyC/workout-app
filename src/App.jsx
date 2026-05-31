import React, { useEffect, useMemo, useState } from "react";
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
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

function ex(name, sets, reps, rest, type) {
  return { name, sets, reps, rest, type };
}

const WARM_UP = [
  ["Arm circles", "30 sec"],
  ["Hip circles", "30 sec"],
  ["Bodyweight squats", "30 sec"],
  ["Shoulder taps", "30 sec"],
  ["Glute bridges", "30 sec"],
  ["Easy incline push-ups", "30 sec"],
];

const PLAN = {
  A: {
    name: "Week A",
    title: "Foundation Strength",
    days: {
      Monday: {
        title: "Push + Legs",
        focus: "Chest, triceps, shoulders, legs",
        exercises: [
          ex("Incline push-ups or normal push-ups", 3, "6 to 12", 75, "pushup"),
          ex("Dumbbell goblet squat", 3, "10 to 15", 60, "squat"),
          ex("Dumbbell floor press", 3, "10 to 15", 60, "floorPress"),
          ex("Reverse lunges", 2, "6 to 8 each leg", 60, "lunge"),
          ex("Dumbbell overhead press", 2, "8 to 12", 60, "press"),
        ],
      },
      Wednesday: {
        title: "Pull + Arms + Core",
        focus: "Back, biceps, posture, abs",
        exercises: [
          ex("One-arm dumbbell row", 3, "10 to 15 each side", 60, "row"),
          ex("Table rows or bedsheet rows", 3, "6 to 10", 75, "bodyRow"),
          ex("Dumbbell curls", 3, "10 to 15", 45, "curl"),
          ex("Glute bridges", 3, "12 to 15", 45, "gluteBridge"),
          ex("Plank", 2, "30 to 45 sec", 45, "plank"),
        ],
      },
      Friday: {
        title: "Full Body",
        focus: "Full-body strength and control",
        exercises: [
          ex("Push-ups or incline push-ups", 3, "6 to 12", 75, "pushup"),
          ex("Dumbbell Romanian deadlift", 3, "10 to 15", 60, "rdl"),
          ex("Dumbbell rows", 3, "10 to 15", 60, "row"),
          ex("Split squat or step-up", 2, "8 each leg", 60, "stepUp"),
          ex("Dead bug", 2, "8 each side", 45, "deadBug"),
        ],
      },
    },
  },
  B: {
    name: "Week B",
    title: "Athletic Build Week",
    days: {
      Monday: {
        title: "Chest + Back",
        focus: "Chest, back, posture, core",
        exercises: [
          ex("Dumbbell floor press", 3, "12 to 15", 60, "floorPress"),
          ex("One-arm dumbbell row", 3, "12 each side", 60, "row"),
          ex("Close-grip incline push-ups", 3, "6 to 10", 60, "pushup"),
          ex("Dumbbell reverse fly", 2, "12 to 15", 45, "reverseFly"),
          ex("Side plank", 2, "20 to 30 sec each side", 45, "plank"),
        ],
      },
      Wednesday: {
        title: "Legs + Core",
        focus: "Legs, glutes, calves, core",
        exercises: [
          ex("Dumbbell goblet squat", 3, "12 to 15", 60, "squat"),
          ex("Dumbbell Romanian deadlift", 3, "10 to 15", 60, "rdl"),
          ex("Glute bridges", 3, "12 to 20", 45, "gluteBridge"),
          ex("Standing calf raises", 3, "15 to 20", 45, "calfRaise"),
          ex("Plank shoulder taps", 2, "10 each side", 45, "plank"),
        ],
      },
      Friday: {
        title: "Shoulders + Arms + Legs",
        focus: "Shoulders, biceps, legs, chest",
        exercises: [
          ex("Dumbbell overhead press", 3, "8 to 12", 60, "press"),
          ex("Dumbbell curls", 3, "10 to 15", 45, "curl"),
          ex("Dumbbell hammer curls", 2, "10 to 15", 45, "curl"),
          ex("Bodyweight squats", 3, "15", 45, "squat"),
          ex("Incline push-ups", 2, "Comfortable reps", 60, "pushup"),
        ],
      },
    },
  },
  C: {
    name: "Week C",
    title: "Strength Skill Week",
    days: {
      Monday: {
        title: "Push Strength",
        focus: "Push-up control, chest, shoulders, core",
        note: "For slow push-ups, take 3 seconds going down, pause, then push up.",
        exercises: [
          ex("Slow push-ups or incline push-ups", 4, "5 to 8", 75, "pushup"),
          ex("Dumbbell floor press", 3, "10 to 12", 60, "floorPress"),
          ex("Dumbbell overhead press", 3, "8 to 10", 60, "press"),
          ex("Close-grip push-ups", 2, "6 to 10", 60, "pushup"),
          ex("Dead bug", 2, "10 each side", 45, "deadBug"),
        ],
      },
      Wednesday: {
        title: "Pull Strength",
        focus: "Rows, back, biceps, core",
        exercises: [
          ex("Table rows or bedsheet rows", 4, "5 to 8", 75, "bodyRow"),
          ex("One-arm dumbbell row", 3, "10 to 12 each side", 60, "row"),
          ex("Dumbbell reverse fly", 2, "12 to 15", 45, "reverseFly"),
          ex("Dumbbell curls", 3, "10 to 12", 45, "curl"),
          ex("Plank", 2, "35 to 45 sec", 45, "plank"),
        ],
      },
      Friday: {
        title: "Legs + Full Body",
        focus: "Legs, hinge, push, calves",
        exercises: [
          ex("Dumbbell goblet squat", 3, "10 to 15", 60, "squat"),
          ex("Dumbbell Romanian deadlift", 3, "10 to 15", 60, "rdl"),
          ex("Step-ups or reverse lunges", 2, "8 each leg", 60, "stepUp"),
          ex("Push-ups", 2, "Comfortable reps", 60, "pushup"),
          ex("Calf raises", 3, "15 to 20", 45, "calfRaise"),
        ],
      },
    },
  },
};

const OPTIONAL_SATURDAY = {
  title: "Light Pump + Mobility",
  focus: "Habit, blood flow, and mobility. Only do this if you feel good.",
  exercises: [
    ex("Dumbbell curls", 2, "12 to 15", 45, "curl"),
    ex("Dumbbell lateral raises", 2, "10 to 15", 45, "lateralRaise"),
    ex("Incline push-ups", 2, "8 to 12", 60, "pushup"),
    ex("Bodyweight squats", 2, "12 to 15", 45, "squat"),
    ex("Hip flexor stretch", 1, "1 min each side", 20, "stretch"),
    ex("Chest stretch", 1, "1 min", 20, "stretch"),
  ],
};

const WEEK_KEYS = ["A", "B", "C"];
const MAIN_DAYS = ["Monday", "Wednesday", "Friday"];
const DAYS = ["Monday", "Wednesday", "Friday", "Saturday"];

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
  lateralRaise: "Raise dumbbells to shoulder height and lower slowly.",
  stretch: "Move gently, breathe slowly, and avoid pain.",
};

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function getNextWeekKey(weekKey) {
  const index = WEEK_KEYS.indexOf(weekKey);
  return WEEK_KEYS[(index + 1) % WEEK_KEYS.length];
}

function getDayPlan(weekKey, day) {
  return day === "Saturday" ? OPTIONAL_SATURDAY : PLAN[weekKey].days[day];
}

function getExerciseKey(weekKey, day, index) {
  return `${weekKey}-${day}-${index}`;
}

function getDayProgress(weekKey, day, completed) {
  const exercises = getDayPlan(weekKey, day).exercises;
  const done = exercises.filter(
    (_, index) => completed[getExerciseKey(weekKey, day, index)],
  ).length;
  return Math.round((done / exercises.length) * 100);
}

function getWeekProgress(weekKey, completed) {
  const keys = MAIN_DAYS.flatMap((day) =>
    PLAN[weekKey].days[day].exercises.map((_, index) =>
      getExerciseKey(weekKey, day, index),
    ),
  );
  const done = keys.filter((key) => completed[key]).length;
  return Math.round((done / keys.length) * 100);
}

function isMainWeekComplete(weekKey, completed) {
  return MAIN_DAYS.every(
    (day) => getDayProgress(weekKey, day, completed) === 100,
  );
}

function getTotalSets(dayPlan) {
  return dayPlan.exercises.reduce((total, item) => total + item.sets, 0);
}

function getDetails(exercise) {
  const shared = {
    description:
      "Move slowly, control the lowering phase, and stop if anything feels sharp or painful.",
    steps: [
      "Set your starting position.",
      "Brace your core.",
      "Move with control.",
      "Reset before the next rep.",
    ],
    avoid: "Do not rush or use painful range of motion.",
  };

  const details = {
    pushup: [
      "Keep your body straight and lower your chest under control.",
      [
        "Hands slightly wider than shoulders.",
        "Brace abs and glutes.",
        "Lower slowly.",
        "Push back up.",
      ],
      "Do not let your hips sag.",
    ],
    squat: [
      "Squat with control while keeping your chest tall.",
      [
        "Feet around shoulder width.",
        "Hold the dumbbell close.",
        "Sit down slowly.",
        "Stand tall.",
      ],
      "Do not force painful depth.",
    ],
    floorPress: [
      "Press dumbbells from the floor and lower them slowly.",
      [
        "Lie on your back.",
        "Start with elbows on the floor.",
        "Press up.",
        "Lower with control.",
      ],
      "Do not bounce your elbows.",
    ],
    row: [
      "Pull the dumbbell toward your hip while keeping your back flat.",
      [
        "Hinge forward.",
        "Keep back flat.",
        "Pull elbow toward hip.",
        "Lower slowly.",
      ],
      "Do not twist your body.",
    ],
    rdl: [
      "Hinge your hips backward, then squeeze your glutes to stand.",
      [
        "Hold dumbbells in front.",
        "Bend knees slightly.",
        "Push hips back.",
        "Stand tall.",
      ],
      "Do not round your back.",
    ],
    plank: [
      "Hold a straight line while bracing abs and glutes.",
      [
        "Elbows under shoulders.",
        "Straight body.",
        "Squeeze abs and glutes.",
        "Breathe steadily.",
      ],
      "Do not let hips drop.",
    ],
    press: [
      "Press dumbbells overhead with your core tight.",
      [
        "Start at shoulders.",
        "Brace core.",
        "Press overhead.",
        "Lower slowly.",
      ],
      "Do not lean back.",
    ],
    curl: [
      "Curl without swinging your body.",
      ["Stand tall.", "Keep elbows still.", "Curl upward.", "Lower slowly."],
      "Do not swing.",
    ],
    gluteBridge: [
      "Lift your hips by squeezing your glutes.",
      ["Lie with knees bent.", "Feet flat.", "Lift hips.", "Lower slowly."],
      "Do not over-arch your back.",
    ],
    deadBug: [
      "Move opposite arm and leg while keeping your back controlled.",
      [
        "Lie on your back.",
        "Brace core.",
        "Lower opposite arm and leg.",
        "Switch sides.",
      ],
      "Do not arch your lower back.",
    ],
    stretch: [
      "Stretch gently and breathe slowly.",
      [
        "Get into position.",
        "Move gently.",
        "Hold the stretch.",
        "Stop if it hurts.",
      ],
      "Do not force pain.",
    ],
  };

  const chosen = details[exercise.type] || shared;
  if (Array.isArray(chosen)) {
    return { description: chosen[0], steps: chosen[1], avoid: chosen[2] };
  }
  return chosen;
}

const ALL_EXERCISES = WEEK_KEYS.flatMap((week) =>
  MAIN_DAYS.flatMap((day) => PLAN[week].days[day].exercises),
).concat(OPTIONAL_SATURDAY.exercises);
console.assert(
  PLAN.A.days.Monday.exercises.length === 5,
  "Week A Monday should have five exercises.",
);
console.assert(
  PLAN.C.days.Monday.exercises[0].sets === 4,
  "Week C push strength starts with four sets.",
);
console.assert(
  getNextWeekKey("A") === "B",
  "Week A should move to Week B next.",
);
console.assert(
  getNextWeekKey("C") === "A",
  "Week C should rotate back to Week A.",
);
console.assert(
  formatTime(75) === "01:15",
  "75 seconds should format as 01:15.",
);
console.assert(formatTime(0) === "00:00", "0 seconds should format as 00:00.");
console.assert(
  ALL_EXERCISES.every((item) => Boolean(DEMO_TEXT[item.type])),
  "Every exercise type needs demo text.",
);

function TinyWeight({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line
        x1="-8"
        y1="0"
        x2="8"
        y2="0"
        stroke="#34d399"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="-12" y="-5" width="5" height="10" rx="1.5" fill="#34d399" />
      <rect x="7" y="-5" width="5" height="10" rx="1.5" fill="#34d399" />
    </g>
  );
}

function MotionArrow({ vertical = true }) {
  return vertical ? (
    <motion.path
      d="M150 78 L150 118"
      stroke="#34d399"
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="8 8"
      animate={{ opacity: [0.35, 1, 0.35], y: [0, 8, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
  ) : (
    <motion.path
      d="M124 96 L166 96"
      stroke="#34d399"
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="8 8"
      animate={{ opacity: [0.35, 1, 0.35], x: [0, 8, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function MiniAnimation({ type, playing, compact = false }) {
  const isPushup = type === "pushup";
  const isSquat = type === "squat";
  const isFloorPress = type === "floorPress";
  const isLunge = type === "lunge";
  const isPress = type === "press";
  const isRow = type === "row";
  const isBodyRow = type === "bodyRow";
  const isCurl = type === "curl";
  const isRdl = type === "rdl";
  const isPlank = type === "plank";
  const isGluteBridge = type === "gluteBridge";
  const isDeadBug = type === "deadBug";
  const isStepUp = type === "stepUp";
  const isReverseFly = type === "reverseFly";
  const isCalfRaise = type === "calfRaise";
  const isLateralRaise = type === "lateralRaise";
  const isStretch = type === "stretch";

  const loop = playing
    ? {
        duration: type === "pushup" ? 1.45 : 1.2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }
    : { duration: 0.2 };

  function StandingFigure() {
    const bodyY = isSquat ? [0, 28, 0] : isCalfRaise ? [0, -10, 0] : 0;
    const handLeft = isPress
      ? { x: [105, 105, 105], y: [110, 48, 110] }
      : isCurl
        ? { x: [98, 118, 98], y: [150, 105, 150] }
        : isLateralRaise
          ? { x: [98, 62, 98], y: [150, 105, 150] }
          : isStretch
            ? { x: [98, 52, 98], y: [150, 100, 150] }
            : { x: 98, y: 150 };
    const handRight = isPress
      ? { x: [195, 195, 195], y: [110, 48, 110] }
      : isCurl
        ? { x: [202, 182, 202], y: [150, 105, 150] }
        : isLateralRaise
          ? { x: [202, 238, 202], y: [150, 105, 150] }
          : isStretch
            ? { x: [202, 248, 202], y: [150, 100, 150] }
            : { x: 202, y: 150 };

    return (
      <motion.g animate={{ y: bodyY }} transition={loop}>
        <circle cx="150" cy="50" r="18" fill="white" />
        <line
          x1="150"
          y1="70"
          x2="150"
          y2="145"
          stroke="white"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <line
          x1="150"
          y1="82"
          x2="105"
          y2="110"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1="150"
          y1="82"
          x2="195"
          y2="110"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.line
          x1="105"
          y1="110"
          x2="98"
          y2="150"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          animate={{ x2: handLeft.x, y2: handLeft.y }}
          transition={loop}
        />
        <motion.line
          x1="195"
          y1="110"
          x2="202"
          y2="150"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          animate={{ x2: handRight.x, y2: handRight.y }}
          transition={loop}
        />
        {(isPress || isCurl || isLateralRaise) && (
          <motion.g
            animate={{ x: handLeft.x, y: handLeft.y }}
            transition={loop}
          >
            <TinyWeight x={0} y={0} />
          </motion.g>
        )}
        {(isPress || isCurl || isLateralRaise) && (
          <motion.g
            animate={{ x: handRight.x, y: handRight.y }}
            transition={loop}
          >
            <TinyWeight x={0} y={0} />
          </motion.g>
        )}
        {isSquat && <TinyWeight x={150} y={125} />}
        <motion.line
          x1="150"
          y1="145"
          x2="112"
          y2="235"
          stroke="white"
          strokeWidth="13"
          strokeLinecap="round"
          animate={{
            x2: isSquat ? [112, 88, 112] : 112,
            y2: isCalfRaise ? [235, 220, 235] : 235,
          }}
          transition={loop}
        />
        <motion.line
          x1="150"
          y1="145"
          x2="188"
          y2="235"
          stroke="white"
          strokeWidth="13"
          strokeLinecap="round"
          animate={{
            x2: isSquat ? [188, 212, 188] : 188,
            y2: isCalfRaise ? [235, 220, 235] : 235,
          }}
          transition={loop}
        />
        <MotionArrow vertical={!isLateralRaise && !isStretch} />
      </motion.g>
    );
  }

  function FloorFigure() {
    if (isFloorPress) {
      return (
        <g>
          <circle cx="82" cy="204" r="17" fill="white" />
          <line
            x1="100"
            y1="210"
            x2="205"
            y2="210"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <motion.line
            x1="125"
            y1="202"
            x2="125"
            y2="150"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{ y2: [150, 72, 150] }}
            transition={loop}
          />
          <motion.line
            x1="165"
            y1="202"
            x2="165"
            y2="150"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{ y2: [150, 72, 150] }}
            transition={loop}
          />
          <motion.g animate={{ y: [150, 72, 150] }} transition={loop}>
            <TinyWeight x={125} y={0} />
            <TinyWeight x={165} y={0} />
          </motion.g>
          <line
            x1="205"
            y1="210"
            x2="254"
            y2="235"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <MotionArrow />
        </g>
      );
    }

    if (isGluteBridge) {
      return (
        <g>
          <circle cx="80" cy="218" r="17" fill="white" />
          <line
            x1="98"
            y1="225"
            x2="135"
            y2="225"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <motion.line
            x1="135"
            y1="225"
            x2="190"
            y2="225"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
            animate={{ y2: [225, 175, 225] }}
            transition={loop}
          />
          <line
            x1="190"
            y1="225"
            x2="246"
            y2="235"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <MotionArrow />
        </g>
      );
    }

    if (isDeadBug) {
      return (
        <g>
          <circle cx="150" cy="210" r="17" fill="white" />
          <line
            x1="150"
            y1="190"
            x2="150"
            y2="135"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <motion.line
            x1="150"
            y1="150"
            x2="105"
            y2="88"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{ x2: [105, 70, 105], y2: [88, 60, 88] }}
            transition={loop}
          />
          <motion.line
            x1="150"
            y1="150"
            x2="195"
            y2="88"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{ x2: [195, 230, 195], y2: [88, 60, 88] }}
            transition={loop}
          />
          <motion.line
            x1="150"
            y1="135"
            x2="105"
            y2="230"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{ x2: [105, 75, 105], y2: [230, 250, 230] }}
            transition={loop}
          />
          <motion.line
            x1="150"
            y1="135"
            x2="195"
            y2="230"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{ x2: [195, 225, 195], y2: [230, 250, 230] }}
            transition={loop}
          />
        </g>
      );
    }

    return (
      <motion.g
        animate={{ y: isPushup ? [0, 24, 0] : isBodyRow ? [18, -12, 18] : 0 }}
        transition={loop}
      >
        {isBodyRow && (
          <line
            x1="48"
            y1="92"
            x2="252"
            y2="92"
            stroke="#34d399"
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}
        <circle cx="70" cy="155" r="17" fill="white" />
        <line
          x1="88"
          y1="160"
          x2="195"
          y2="172"
          stroke="white"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <line
          x1="105"
          y1="170"
          x2={isBodyRow ? "108" : "95"}
          y2={isBodyRow ? "92" : "235"}
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1="145"
          y1="174"
          x2={isBodyRow ? "145" : "145"}
          y2={isBodyRow ? "92" : "235"}
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1="195"
          y1="172"
          x2="260"
          y2="235"
          stroke="white"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {isPlank && (
          <text x="116" y="104" fill="#34d399" fontSize="20" fontWeight="900">
            HOLD
          </text>
        )}
        {!isPlank && <MotionArrow vertical={isPushup} />}
      </motion.g>
    );
  }

  function HingeFigure() {
    return (
      <g>
        {isStepUp && (
          <rect
            x="196"
            y="220"
            width="70"
            height="32"
            rx="6"
            fill="rgba(52,211,153,.45)"
          />
        )}
        <motion.g
          animate={{ y: isLunge || isStepUp ? [0, 24, 0] : 0 }}
          transition={loop}
        >
          <motion.circle
            cx="112"
            cy="68"
            r="17"
            fill="white"
            animate={{
              cx: isRow || isRdl || isReverseFly ? [112, 95, 112] : 112,
              cy: isRow || isRdl || isReverseFly ? [68, 105, 68] : 68,
            }}
            transition={loop}
          />
          <motion.line
            x1="125"
            y1="88"
            x2="170"
            y2="150"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
            animate={{
              x1: isRow || isRdl || isReverseFly ? [125, 105, 125] : 125,
              y1: isRow || isRdl || isReverseFly ? [88, 120, 88] : 88,
              x2: isRow || isRdl || isReverseFly ? [170, 190, 170] : 170,
              y2: isRow || isRdl || isReverseFly ? [150, 160, 150] : 150,
            }}
            transition={loop}
          />
          <motion.line
            x1="135"
            y1="108"
            x2="108"
            y2="175"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{
              x2: isRow
                ? [108, 185, 108]
                : isReverseFly
                  ? [108, 70, 108]
                  : isRdl
                    ? [108, 130, 108]
                    : 108,
              y2:
                isRow || isReverseFly
                  ? [175, 140, 175]
                  : isRdl
                    ? [175, 215, 175]
                    : 175,
            }}
            transition={loop}
          />
          {(isRow || isRdl || isReverseFly) && (
            <motion.g
              animate={{
                x: isRow
                  ? [108, 185, 108]
                  : isReverseFly
                    ? [108, 70, 108]
                    : [108, 130, 108],
                y: isRow || isReverseFly ? [175, 140, 175] : [175, 215, 175],
              }}
              transition={loop}
            >
              <TinyWeight x={0} y={0} />
            </motion.g>
          )}
          <motion.line
            x1="170"
            y1="150"
            x2="120"
            y2="245"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
            animate={{
              x2: isStepUp ? [120, 202, 120] : isLunge ? [120, 92, 120] : 120,
            }}
            transition={loop}
          />
          <motion.line
            x1="170"
            y1="150"
            x2="220"
            y2="245"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
            animate={{
              x2: isStepUp ? [220, 248, 220] : isLunge ? [220, 250, 220] : 220,
            }}
            transition={loop}
          />
          <MotionArrow vertical={!isRow && !isReverseFly} />
        </motion.g>
      </g>
    );
  }

  const group =
    isFloorPress ||
    isPushup ||
    isBodyRow ||
    isPlank ||
    isGluteBridge ||
    isDeadBug
      ? "floor"
      : isRow || isRdl || isLunge || isStepUp || isReverseFly
        ? "hinge"
        : "standing";

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
      <div
        className={`${compact ? "h-56" : "h-[320px] md:h-[420px]"} relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800`}
      >
        <svg viewBox="0 0 300 280" className="h-full w-full">
          <line
            x1="35"
            y1="252"
            x2="265"
            y2="252"
            stroke="rgba(255,255,255,.2)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {group === "floor" ? (
            <FloorFigure />
          ) : group === "hinge" ? (
            <HingeFigure />
          ) : (
            <StandingFigure />
          )}
        </svg>
        {!compact && (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/80 p-3">
            <p className="text-sm font-bold text-white">{DEMO_TEXT[type]}</p>
          </div>
        )}
      </div>
    </div>
  );
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
              className={`rounded-2xl border p-3 text-center text-sm font-black ${done ? "border-emerald-400 bg-emerald-400 text-slate-950" : active ? "border-white bg-white text-slate-950" : "border-white/10 bg-white/5 text-slate-400"}`}
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
      <h3 className="font-black text-white">3-minute warm-up</h3>
      <p className="mt-1 text-sm text-slate-400">
        Do this before every workout. No jumping. Keep leg work controlled and
        pain-free.
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

function WorkoutOverview({
  week,
  day,
  plan,
  progress,
  completed,
  selectedWeek,
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-semibold text-emerald-400">
            {week.name}: {week.title}
          </p>
          <h2 className="text-3xl font-black">
            {day}: {plan.title}
          </h2>
          <p className="mt-1 text-slate-300">{plan.focus}</p>
          {plan.note && (
            <p className="mt-2 rounded-2xl bg-emerald-400/10 p-3 text-sm text-emerald-100">
              {plan.note}
            </p>
          )}
        </div>
        <div className="text-sm text-slate-400">
          {plan.exercises.length} exercises • {getTotalSets(plan)} sets • about
          20 to 25 min
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
          const done = completed[getExerciseKey(selectedWeek, day, index)];
          return (
            <div
              key={`${day}-${item.name}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${done ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-slate-300"}`}
                >
                  {done ? <CheckCircle2 size={18} /> : index + 1}
                </div>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-slate-400">
                    {item.sets} sets × {item.reps} • Rest {item.rest}s
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

function DayPicker({ selectedDay, selectedWeek, completed, onChooseDay }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-4">
      <div className="mb-3 flex items-center gap-2 font-black">
        <CalendarDays size={18} /> Training Days
      </div>
      <div className="space-y-2">
        {DAYS.map((day) => {
          const dayProgress = getDayProgress(selectedWeek, day, completed);
          const active = selectedDay === day;
          const plan = getDayPlan(selectedWeek, day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onChooseDay(day)}
              className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-emerald-400 bg-emerald-400 text-slate-950" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black">
                    {day}
                    {day === "Saturday" ? " Optional" : ""}
                  </p>
                  <p
                    className={`text-sm ${active ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {plan.title}
                  </p>
                </div>
                <p className="font-black">{dayProgress}%</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WorkoutSession({
  week,
  day,
  exercise,
  exerciseIndex,
  totalExercises,
  setNumber,
  resting,
  restLeft,
  restInfo,
  isPlaying,
  onExit,
  onTogglePlay,
  onCompleteSet,
  onSkipRest,
  onBack,
  onNext,
}) {
  return (
    <main className="rounded-[2rem] border border-white/10 bg-slate-900 p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-emerald-400">
            {week.name} • {day} • Exercise {exerciseIndex + 1} of{" "}
            {totalExercises}
          </p>
          <h2 className="text-2xl font-black md:text-4xl">{exercise.name}</h2>
          <p className="mt-1 text-slate-300">
            Set {setNumber} of {exercise.sets} • Target: {exercise.reps}
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
              <ExerciseInstructions exercise={exercise} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={onTogglePlay}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-4 font-black hover:bg-white/20"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}{" "}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={onCompleteSet}
              className="rounded-2xl bg-emerald-400 p-4 font-black text-slate-950"
            >
              Complete Set
            </button>
          </div>
        </>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={exerciseIndex === 0}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-3 font-bold disabled:opacity-40"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={exerciseIndex === totalExercises - 1}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-3 font-bold disabled:opacity-40"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}

function WorkoutDashboard() {
  const [selectedWeek, setSelectedWeek] = useState("A");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [started, setStarted] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(0);
  const [completed, setCompleted] = useState({});
  const [restInfo, setRestInfo] = useState(null);

  const week = PLAN[selectedWeek];
  const dayPlan = getDayPlan(selectedWeek, selectedDay);
  const exercise = dayPlan.exercises[exerciseIndex] || dayPlan.exercises[0];
  const progress = getDayProgress(selectedWeek, selectedDay, completed);
  const currentWeekProgress = useMemo(
    () => getWeekProgress(selectedWeek, completed),
    [selectedWeek, completed],
  );
  const nextWeekKey = getNextWeekKey(selectedWeek);

  useEffect(() => {
    if (!resting || restLeft <= 0) return undefined;
    const timerId = window.setInterval(
      () => setRestLeft((value) => Math.max(value - 1, 0)),
      1000,
    );
    return () => window.clearInterval(timerId);
  }, [resting, restLeft]);

  useEffect(() => {
    if (resting && restLeft === 0) {
      setResting(false);
      setIsPlaying(true);
    }
  }, [resting, restLeft]);

  function resetSession() {
    setStarted(false);
    setExerciseIndex(0);
    setSetNumber(1);
    setResting(false);
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
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
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
  }

  function finishSet() {
    if (setNumber < exercise.sets) {
      const nextSet = setNumber + 1;
      setRestInfo({
        completed: `Set ${setNumber} of ${exercise.sets} complete`,
        next: `Next: Set ${nextSet} of ${exercise.sets}`,
      });
      setSetNumber(nextSet);
      setResting(true);
      setRestLeft(exercise.rest);
      setIsPlaying(false);
      return;
    }

    const completedKey = getExerciseKey(
      selectedWeek,
      selectedDay,
      exerciseIndex,
    );
    const nextCompleted = { ...completed, [completedKey]: true };
    setCompleted(nextCompleted);

    if (exerciseIndex < dayPlan.exercises.length - 1) {
      const nextExercise = dayPlan.exercises[exerciseIndex + 1];
      setRestInfo({
        completed: `${exercise.name} complete`,
        next: `Next: ${nextExercise.name}`,
      });
      setExerciseIndex((index) => index + 1);
      setSetNumber(1);
      setResting(true);
      setRestLeft(exercise.rest);
      setIsPlaying(false);
      return;
    }

    if (
      selectedDay === "Friday" &&
      isMainWeekComplete(selectedWeek, nextCompleted)
    ) {
      setSelectedWeek(getNextWeekKey(selectedWeek));
      setSelectedDay("Monday");
    }

    resetSession();
  }

  function goNext() {
    if (exerciseIndex >= dayPlan.exercises.length - 1) return;
    setExerciseIndex((index) => index + 1);
    setSetNumber(1);
    setResting(false);
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
  }

  function goBack() {
    if (exerciseIndex <= 0) return;
    setExerciseIndex((index) => index - 1);
    setSetNumber(1);
    setResting(false);
    setRestLeft(0);
    setIsPlaying(true);
    setRestInfo(null);
  }

  function resetProgress() {
    setCompleted({});
    setSelectedWeek("A");
    setSelectedDay("Monday");
    resetSession();
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {!started ? (
          <>
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 p-6 shadow-2xl md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
                    <Dumbbell size={16} /> 5 kg dumbbell rotation
                  </div>
                  <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
                    A/B/C weekly workout coach.
                  </h1>
                  <p className="mt-4 max-w-xl text-slate-300">
                    Start at Week A. Complete Monday, Wednesday, and Friday,
                    then the app automatically moves you to Week B. After Week
                    C, it loops back to Week A.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {WEEK_KEYS.map((weekKey) => (
                      <div
                        key={weekKey}
                        className={`rounded-2xl px-5 py-3 font-black ${selectedWeek === weekKey ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-slate-400"}`}
                      >
                        {PLAN[weekKey].name}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
                    <Stat
                      label="Current week"
                      value={`${currentWeekProgress}%`}
                    />
                    <Stat label="Next week" value={nextWeekKey} />
                    <Stat label="Main days" value="3+1" />
                  </div>
                  <button
                    type="button"
                    onClick={startWorkout}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:scale-[1.02]"
                  >
                    <Play size={20} /> Start {week.name} {selectedDay}
                  </button>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Selected workout</p>
                      <h2 className="text-2xl font-black">
                        {week.name}: {selectedDay}
                      </h2>
                    </div>
                    <div className="rounded-full bg-emerald-400 px-3 py-1 text-sm font-black text-slate-950">
                      {progress}%
                    </div>
                  </div>
                  <MiniAnimation
                    type={dayPlan.exercises[0].type}
                    playing={true}
                    compact
                  />
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <main className="space-y-6">
                <WarmUpCard />
                <WorkoutOverview
                  week={week}
                  day={selectedDay}
                  plan={dayPlan}
                  progress={progress}
                  completed={completed}
                  selectedWeek={selectedWeek}
                />
              </main>
              <aside className="space-y-4">
                <DayPicker
                  selectedDay={selectedDay}
                  selectedWeek={selectedWeek}
                  completed={completed}
                  onChooseDay={chooseDay}
                />
                <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-4">
                  <h3 className="font-black">Automatic rotation</h3>
                  <p className="mt-3 text-sm text-slate-300">
                    Complete Monday, Wednesday, and Friday to move from Week A
                    to Week B, then Week C, then back to Week A.
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
            week={week}
            day={selectedDay}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            totalExercises={dayPlan.exercises.length}
            setNumber={setNumber}
            resting={resting}
            restLeft={restLeft}
            restInfo={restInfo}
            isPlaying={isPlaying}
            onExit={resetSession}
            onTogglePlay={() => setIsPlaying((value) => !value)}
            onCompleteSet={finishSet}
            onSkipRest={() => {
              setResting(false);
              setRestLeft(0);
              setIsPlaying(true);
            }}
            onBack={goBack}
            onNext={goNext}
          />
        )}
      </div>
    </div>
  );
}

function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession || null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleAuth(event) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage(
        "Supabase is not connected yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.",
      );
      return;
    }

    const credentials = { email: email.trim(), password };
    const result =
      mode === "signup"
        ? await supabase.auth.signUp(credentials)
        : await supabase.auth.signInWithPassword(credentials);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup") {
      setMessage(
        "Account created. Now disable new signups in Supabase so only this account can sign in.",
      );
      setMode("login");
      return;
    }

    setMessage("");
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">Loading...</div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-slate-900 p-6">
          <h1 className="text-3xl font-black">Connect Supabase first</h1>
          <p className="mt-3 text-slate-300">
            Create a Supabase project, then add these to a file called{" "}
            <span className="font-bold text-white">.env</span> in your project
            root:
          </p>
          <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-emerald-300">
            {`VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key`}
          </pre>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
        <div className="mx-auto grid min-h-[85vh] max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
              <Dumbbell size={16} /> Private workout app
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Login to your workout coach.
            </h1>
            <p className="mt-4 max-w-xl text-slate-300">
              Create your first account once, then disable signups in Supabase.
              After that, only the existing account can log in.
            </p>
          </div>

          <form
            onSubmit={handleAuth}
            className="rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-black">
              {mode === "login" ? "Log in" : "Create first account"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Use email and password authentication.
            </p>

            <label className="mt-5 block text-sm font-bold text-slate-300">
              Email
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />

            <label className="mt-4 block text-sm font-bold text-slate-300">
              Password
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              minLength={6}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />

            {message && (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-black text-slate-950"
            >
              {mode === "login" ? "Log in" : "Create account"}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="mt-3 w-full rounded-2xl bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/20"
            >
              {mode === "login" ? "Create first account" : "Back to login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-50 rounded-2xl border border-white/10 bg-slate-900/90 p-2 backdrop-blur">
        <button
          type="button"
          onClick={signOut}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );
}

export default function WorkoutApp() {
  return (
    <AuthGate>
      <WorkoutDashboard />
    </AuthGate>
  );
}
