import { useState, useRef } from "react";

function TodoApp() {
  const [todos, setTodos] = useState([]); // Danh sách công việc
  const [editIndex, setEditIndex] = useState(null); // Lưu vị trí công việc đang sửa
  const inputRef = useRef(null); // Tham chiếu đến ô input

  // Thêm hoặc cập nhật công việc
  const handleAddOrUpdate = () => {
    const newTodo = inputRef.current.value.trim();
    if (!newTodo) return; // Không nhập thì không làm gì

    if (editIndex !== null) {
      // Nếu đang sửa
      console.log(`Cập nhật công việc: "${todos[editIndex]}" → "${newTodo}"`);
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = newTodo;
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      // Nếu đang thêm mới
      console.log(`Thêm công việc: "${newTodo}"`);
      setTodos([...todos, newTodo]);
    }

    console.log(" Danh sách công việc hiện tại:", [...todos, newTodo]);
    inputRef.current.value = ""; // Xóa input sau khi nhập
  };

  // Xóa công việc
  const handleDelete = (index) => {
    console.log(`🗑 Xóa công việc: "${todos[index]}"`);
    setTodos(todos.filter((_, i) => i !== index));
    console.log(
      "Danh sách công việc sau khi xóa:",
      todos.filter((_, i) => i !== index)
    );
  };

  // Chỉnh sửa công việc
  const handleEdit = (index) => {
    console.log(`Chỉnh sửa công việc: "${todos[index]}"`);
    inputRef.current.value = todos[index]; // Hiển thị nội dung cần sửa
    setEditIndex(index); // Đánh dấu đang sửa
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Todo App (useRef + useState)</h2>

      <div className="mb-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nhập công việc..."
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddOrUpdate}
          className="p-2 bg-blue-500 text-white"
        >
          {editIndex !== null ? "Cập nhật" : "Thêm"}
        </button>
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border"
          >
            <span>{todo}</span>
            <div>
              <button
                onClick={() => handleEdit(index)}
                className="mr-2 p-1 bg-yellow-500 text-white"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-1 bg-red-500 text-white"
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
