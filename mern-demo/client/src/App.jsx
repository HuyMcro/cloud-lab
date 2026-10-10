import { useState, useEffect } from 'react';
import './App.css';

// Tự động lấy URL API từ biến môi trường (Render/Vite) hoặc dùng đường dẫn tương đối
const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Form
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null); // Quản lý trạng thái đang sửa

  // Hàm tải danh sách sinh viên từ Backend
  const fetchStudents = () => {
    fetch(`${API_URL}/api/students`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
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

  // Hàm Thêm (POST) hoặc Cập nhật (PUT) sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Cập nhật sinh viên (PUT)
      fetch(`${API_URL}/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email }),
      })
        .then((res) => res.json())
        .then((updatedStudent) => {
          setStudents(students.map((std) => (std._id === editingId ? updatedStudent : std)));
          resetForm();
        })
        .catch((err) => console.error('Lỗi khi cập nhật sinh viên:', err));
    } else {
      // Thêm mới sinh viên (POST)
      fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email }),
      })
        .then((res) => res.json())
        .then((newStudent) => {
          setStudents([...students, newStudent]);
          resetForm();
        })
        .catch((err) => console.error('Lỗi khi thêm sinh viên:', err));
    }
  };

  // Hàm Xóa sinh viên (DELETE)
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      fetch(`${API_URL}/api/students/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then(() => {
          setStudents(students.filter((std) => std._id !== id));
        })
        .catch((err) => console.error('Lỗi khi xóa sinh viên:', err));
    }
  };

  // Chuyển Form sang chế độ Sửa
  const handleEdit = (std) => {
    setEditingId(std._id);
    setStudentId(std.studentId);
    setName(std.name);
    setEmail(std.email);
  };

  const resetForm = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{editingId ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}</h2>
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px', backgroundColor: editingId ? '#2196F3' : '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', flex: 1 }}>
            {editingId ? 'Lưu Cập Nhật' : 'Thêm Sinh Viên'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: '10px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', cursor: 'pointer' }}>
              Hủy
            </button>
          )}
        </div>
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
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((std) => (
                <tr key={std._id}>
                  <td>{std.studentId}</td>
                  <td>{std.name}</td>
                  <td>{std.email}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleEdit(std)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#FFC107', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>Sửa</button>
                    <button onClick={() => handleDelete(std._id)} style={{ padding: '5px 10px', backgroundColor: '#F44336', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;