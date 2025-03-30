import { useRef, useState } from "react";

function UseRefComponent() {
  const inputRef = useRef(); // Tạo ref cho input

  var [name, setName] = useState();

  const handleClick = () => {
    console.log(inputRef.current.value);
    setName(inputRef.current.value); // Cập nhật state
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-lime-100">
      <div className=" text-3xl bg-slate-300 flex flex-col w-1/2 h-1/2 justify-center items-center gap-4 p-4 rounded-xl shadow-xl shadow-stone-700">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nhập gì đó..."
          className="border border-gray-400 p-2 rounded"
        />
        <button
          onClick={handleClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Click
        </button>
        <h1>Gia tri ban vua nhap la: {name}</h1>
      </div>
    </div>
  );
}

export default UseRefComponent;
