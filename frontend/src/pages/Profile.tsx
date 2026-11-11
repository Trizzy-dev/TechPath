import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout>
      <main className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              My Profile
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View your account information.
            </p>
          </header>

          <section className="rounded-xl border bg-white p-6 sm:p-8">
            <div className="flex items-center gap-4 border-b pb-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {initials || "U"}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-gray-900">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {user?.email}
                </p>

                <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                  {user?.role || "Learner"}
                </span>
              </div>
            </div>

            <div className="space-y-5 pt-6">
              <h3 className="font-semibold text-gray-900">
                Account Information
              </h3>

              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="mt-1 font-medium text-gray-800">
                  {user?.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="mt-1 break-all font-medium text-gray-800">
                  {user?.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Account Role</p>
                <p className="mt-1 font-medium capitalize text-gray-800">
                  {user?.role || "learner"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}