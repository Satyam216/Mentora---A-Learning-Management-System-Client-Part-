export default function CoursesMiniGrid() {
  return (
    <>
      <h2 className="text-xl font-semibold">Your Courses</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="course-card">Course A</div>
        <div className="course-card">Course B</div>
        <div className="course-card">Course C</div>
      </div>

      <style jsx>{`
        .course-card {
          padding: 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
        }
      `}</style>
    </>
  );
}
