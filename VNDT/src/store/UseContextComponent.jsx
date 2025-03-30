import { useStore, actions } from ".";

function UseContextComponent() {
  const [state, dispatch] = useStore();
  const { todos, todoInput } = state;

  const handleAdd = () => {
    if (todoInput.trim() !== "") {
      dispatch(actions.addTodo(todoInput));
      dispatch(actions.setTodoInput("")); // Xóa input sau khi thêm
    }
  };

  const handleEdit = (index) => {
    dispatch(actions.setTodoInput(todos[index])); // Gán lại input để sửa
    dispatch(actions.deleteTodo(index)); // Xóa công việc cũ
  };

  const handleDelete = (index) => {
    dispatch(actions.deleteTodo(index));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Quản lý công việc
      </h1>

      <div className="flex gap-2">
        <input
          value={todoInput}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập công việc..."
          onChange={(e) => dispatch(actions.setTodoInput(e.target.value))}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleAdd}
        >
          Thêm
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm hover:bg-gray-200 transition"
          >
            <span
              className="cursor-pointer flex-1 text-gray-800"
              onClick={() => handleEdit(index)}
            >
              {todo}
            </span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              onClick={() => handleDelete(index)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UseContextComponent;
