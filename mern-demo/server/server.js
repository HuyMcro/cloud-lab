const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Kết nối MongoDB Atlas thành công!'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB Atlas:', err));

app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend Express đang hoạt động thành công!" });
});

// Câu 36: API GET /api/students - Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sinh viên", error: error.message });
  }
});

// Câu 37: API POST /api/students - Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm sinh viên", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});

// Câu 38: API PUT /api/students/:id - Cập nhật thông tin sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }
    
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật sinh viên", error: error.message });
  }
});

// Câu 39: API DELETE /api/students/:id - Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }
    res.status(200).json({ message: "Xóa sinh viên thành công", student: deletedStudent });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sinh viên", error: error.message });
  }
});