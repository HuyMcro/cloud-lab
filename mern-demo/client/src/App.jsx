import { useState, useEffect } from 'react';

// Dùng đường dẫn tương đối để gọi API qua Reverse Proxy / Vite Proxy
const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Form
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

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
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <span style={styles.badge}>
          <span style={styles.badgeDot}></span>
          Phiên bản 2.0 - Production Cloud PaaS (Auto-Deployed)
        </span>
        <h1 style={styles.title}>Hệ Thống Quản Lý Sinh Viên</h1>
        <p style={styles.subtitle}>
          Ứng dụng MERN Stack Multi-Container triển khai trên hạ tầng Render Cloud
        </p>
      </div>

      {/* Main Content Grid / Stack */}
      <div style={styles.content}>
        {/* Form Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              {editingId ? '✏️ Cập Nhật Thông Tin Sinh Viên' : '➕ Thêm Sinh Viên Mới'}
            </h2>
            <p style={styles.cardDescription}>
              {editingId
                ? 'Chỉnh sửa thông tin chi tiết của sinh viên bên dưới'
                : 'Nhập đầy đủ thông tin để lưu sinh viên vào MongoDB Atlas Cloud'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Mã sinh viên (MSSV)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: SV001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Họ và tên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroupFull}>
                <label style={styles.label}>Địa chỉ Email</label>
                <input
                  type="email"
                  placeholder="nguyenvana@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={{
                  ...styles.btnPrimary,
                  backgroundColor: editingId ? '#2563eb' : '#059669',
                }}
              >
                {editingId ? 'Lưu Thay Đổi' : 'Thêm Sinh Viên'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={styles.btnSecondary}>
                  Hủy Thao Tác
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.cardTitle}>📋 Danh Sách Sinh Viên</h2>
              <p style={styles.cardDescription}>
                Tổng số sinh viên trong cơ sở dữ liệu: <strong>{students.length}</strong>
              </p>
            </div>
            <button onClick={fetchStudents} style={styles.btnRefresh} title="Làm mới dữ liệu">
              🔄 Tải lại
            </button>
          </div>

          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner}></div>
              <p>Đang tải dữ liệu từ MongoDB Atlas...</p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>MSSV</th>
                    <th style={styles.th}>HỌ VÀ TÊN</th>
                    <th style={styles.th}>EMAIL</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((std, index) => (
                      <tr
                        key={std._id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                        }}
                      >
                        <td style={styles.td}>
                          <span style={styles.mssvTag}>{std.studentId}</span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: '600', color: '#0f172a' }}>
                          {std.name}
                        </td>
                        <td style={{ ...styles.td, color: '#475569' }}>{std.email}</td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <button
                            onClick={() => handleEdit(std)}
                            style={styles.btnEdit}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(std._id)}
                            style={styles.btnDelete}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={styles.emptyState}>
                        📂 Chưa có sinh viên nào trong danh sách.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// System Inline Styling System (Modern SaaS Concept)
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 35px auto',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
    border: '1px solid #bbf7d0',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#0f172a',
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '15px',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    padding: '28px',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    margin: '0 0 4px 0',
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '700',
  },
  cardDescription: {
    margin: 0,
    color: '#64748b',
    fontSize: '13px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputGroupFull: {
    gridColumn: 'span 2',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    transition: 'border-color 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '6px',
  },
  btnPrimary: {
    flex: 1,
    padding: '12px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  btnSecondary: {
    padding: '12px 20px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnRefresh: {
    padding: '8px 14px',
    backgroundColor: '#f8fafc',
    color: '#334155',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    borderBottom: '1px solid #f1f5f9',
  },
  mssvTag: {
    display: 'inline-block',
    padding: '3px 8px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
  btnEdit: {
    marginRight: '6px',
    padding: '6px 12px',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    border: '1px solid #fde68a',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnDelete: {
    padding: '6px 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loadingState: {
    padding: '40px 0',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #2563eb',
    borderRadius: '50%',
    margin: '0 auto 12px auto',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    padding: '30px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '14px',
  },
};

export default App;