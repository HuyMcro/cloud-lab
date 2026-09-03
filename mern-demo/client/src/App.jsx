import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Form (Câu 48)
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Hàm tải danh sách sinh viênt từ Backend
  const fetchStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm gửi dữ liệu POST thêm sinh viên (Câu 49)
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, name, email }),
    })
      .then((res) => res.json())
      .then((newStudent) => {
        setStudents([...students, newStudent]);
        setStudentId('');
        setName('');
        setEmail('');
      })
      .catch((err) => console.error('Lỗi khi thêm sinh viên:', err));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Thêm Sinh Viên Mới</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Mã sinh viên (MSSV)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Thêm Sinh Viên
        </button>
      </form>

      <h2>Danh Sách Sinh Viên</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Mã SV</th>
              <th>Họ và Tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((std) => (
                <tr key={std._id}>
                  <td>{std.studentId}</td>
                  <td>{std.name}</td>
                  <td>{std.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Chưa có sinh viên nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;