import { useReducer } from "react";

function reducer(count, action) {
  console.log(action);

  switch (action.type) {
    case "+":
      return { ...count, m: count.m + 1 };
    case "-":
      return { ...count, m: count.m - 1 };
    case "0":
      return { ...count, m: 0 };
    default:
      return count;
  }
}

function UseReducerComponent() {
  const [count, dispatch] = useReducer(reducer, { m: 0 });

  return (
    <div className="bg-blue-100 flex-col flex items-center justify-center h-screen gap-8">
      <div className="text-4xl items-center justify-center flex-col flex bg-white w-1/2 h-1/2 rounded-xl shadow-xl shadow-stone-700 gap-8">
        <p>
          <strong>Giá trị hiện tại:</strong> {count.m}
        </p>

        <button
          className="bg-green-700 rounded px-4 py-2 text-white"
          onClick={() => dispatch({ type: "+" })}
        >
          Tăng 1
        </button>

        <button
          className="bg-red-700 rounded px-4 py-2 text-white"
          onClick={() => dispatch({ type: "-" })}
        >
          Giảm 1
        </button>
        <button
          className="bg-pink-700 rounded px-4 py-2 text-white"
          onClick={() => dispatch({ type: "0" })}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default UseReducerComponent;
