import { useState } from "react";
import Content_1 from "./Content_1";

function Memomo() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(count + 1);
  };

  return (
    <div className=" text-3xl font-bold bg-stone-600 text-center flex flex-col rounded-xl mt-[300px] p-4">
      <Content_1 />
      <h2>{count}</h2>

      <div className="flex justify-center items-center mt-4">
        <button
          className="bg-blue-300 px-6 py-2 rounded-lg font-semibold hover:bg-blue-100"
          onClick={increase}
        >
          Tang
        </button>
      </div>
    </div>
  );
}
export default Memomo;
