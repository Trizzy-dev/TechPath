import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const learningStages = [
  {
    number: "01",
    title: "HTML",
    description: "Build the structure of web pages.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    number: "02",
    title: "CSS",
    description: "Style pages and create beautiful layouts.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    number: "03",
    title: "JavaScript",
    description: "Make websites interactive and dynamic.",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    number: "04",
    title: "React",
    description: "Build interactive interfaces with components.",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    number: "05",
    title: "TypeScript",
    description: "Write safer, more reliable JavaScript.",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    number: "06",
    title: "Tailwind CSS",
    description: "Create modern interfaces with utility classes.",
    color: "bg-teal-100 text-teal-700",
  },
];

const features = [
  {
    number: "01",
    title: "Learn in order",
    description:
      "Follow a structured roadmap that takes you from the fundamentals to modern frontend development.",
  },
  {
    number: "02",
    title: "Track your progress",
    description:
      "Keep track of completed tasks, ongoing learning, and the milestones you've achieved.",
  },
  {
    number: "03",
    title: "Learn with resources",
    description:
      "Access curated learning materials that help you understand each topic and continue practising.",
  },
];

function Home() {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-100">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Tech<span className="text-blue-600">Path</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/roadmap"
              className="hidden text-sm font-medium text-slate-600 hover:text-blue-600 sm:block"
            >
              Roadmap
            </Link>

            {user ? (
              <Link
                to={dashboardPath}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                My Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-8">
              <img
                src="images/techPath-Logo.png"
                alt="TechPath Logo"
                className="w-full max-w-xl object-contain"
              />
            </div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Your journey into frontend development
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Turn your curiosity into{" "}
              <span className="text-blue-600">real skills.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Learn frontend development one step at a time.
              Follow a structured roadmap, complete practical tasks,
              and track your progress as you grow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={user ? dashboardPath : "/register"}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {user ? "Go to Dashboard" : "Start Learning"}
                <span className="ml-2">→</span>
              </Link>

              <Link
                to="/roadmap"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600"
              >
                Explore Roadmap
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Start with the basics. Build towards something great.
            </p>
          </div>

          {/* Roadmap preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  YOUR LEARNING JOURNEY
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  Frontend Roadmap
                </h2>
              </div>

              <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                6 stages
              </span>
            </div>

            <div className="mt-7 space-y-3">
              {learningStages.map((stage, index) => (
                <div
                  key={stage.number}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-slate-50"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${stage.color}`}
                  >
                    {stage.number}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{stage.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {stage.description}
                    </p>
                  </div>

                  {index < learningStages.length - 1 && (
                    <span className="hidden text-slate-300 sm:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>

            <Link
              to="/roadmap"
              className="mt-5 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View the full roadmap →
            </Link>
          </div>
        </div>
      </section>

      {/* Learning process */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            A clearer path to learning
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Learning to code becomes easier when you know what to
            learn next and can see how far you've come.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="rounded-xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <span className="text-sm font-bold text-blue-600">
                {feature.number}
              </span>

              <h3 className="mt-4 text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-5 pb-20 sm:px-8 md:pb-24">
        <div className="mx-auto max-w-7xl rounded-2xl bg-blue-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your next skill starts here.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100 text-center">
            Take the first step towards becoming a frontend
            developer. Learn at your own pace and keep moving forward.
          </p>

          <Link
            to={user ? dashboardPath : "/register"}
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            {user ? "Open Dashboard" : "Create Your Account"}
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link to="/" className="text-lg font-bold text-slate-900">
            Tech<span className="text-blue-600">Path</span>
          </Link>

          <p>
            © {new Date().getFullYear()} TechPath. Keep learning, keep building.
          </p>

          <Link
            to="/roadmap"
            className="font-medium hover:text-blue-600"
          >
            Explore Roadmap
          </Link>
        </div>
      </footer>
    </main>
  );
}

export default Home;