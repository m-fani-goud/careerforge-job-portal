import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">Total Jobs</h2>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">Applications</h2>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">Profile Views</h2>
          <p className="text-2xl font-bold">20</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-5 rounded shadow mt-6">
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>

        <p className="text-gray-600">
          You applied for React Developer at Google.
        </p>
      </div>
    </DashboardLayout>
  );
}