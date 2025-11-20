export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="card">
        <h3 className="text-sm text-gray-500">Total Students</h3>
        <p className="text-3xl font-bold mt-2">580</p>
      </div>

      <div className="card">
        <h3 className="text-sm text-gray-500">Total Courses</h3>
        <p className="text-3xl font-bold mt-2">18</p>
      </div>

      <div className="card">
        <h3 className="text-sm text-gray-500">Weekly Views</h3>
        <p className="text-3xl font-bold mt-2">3,420</p>
      </div>

      <style jsx>{`
        .card {
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
