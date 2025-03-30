import { useCallback, useState } from "react";
import Content from "./Content";

function UseCallbackComponent() {
  const [count, setCount] = useState(0);

  // useCallback để tránh tạo lại hàm khi component re-render
  const handleIncrease = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="text-3xl font-bold bg-sky-100 text-black text-center flex flex-col rounded-xl p-6 shadow-lg">
        <h1 className="text-4xl mb-4">UseCallback Example</h1>

        {/* Component con (được bọc memo để tối ưu re-render) */}
        <Content onIncrease={handleIncrease} />

        {/* Hiển thị số đếm */}
        <p className="text-5xl font-semibold mt-4">{count}</p>
      </div>
    </div>
  );
}

export default UseCallbackComponent;
