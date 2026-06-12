import { Dumbbell } from "lucide-react";

export default function LoginPage({
  mode,
  email,
  password,
  authMessage,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onToggleMode,
}) {
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
            Your workout progress will sync across devices.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-black">
            {mode === "login" ? "Log in" : "Create first account"}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Use your email and password.
          </p>

          <label className="mt-5 block text-sm font-bold text-slate-300">
            Email
          </label>
          <input
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          />

          <label className="mt-4 block text-sm font-bold text-slate-300">
            Password
          </label>
          <input
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            type="password"
            required
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
          />

          {authMessage && (
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
              {authMessage}
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
            onClick={onToggleMode}
            className="mt-3 w-full rounded-2xl bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/20"
          >
            {mode === "login" ? "Create first account" : "Back to login"}
          </button>
        </form>
      </div>
    </div>
  );
}
