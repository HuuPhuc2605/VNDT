import { memo } from "react";

function Content({ onIncrease }) {
  console.log("Content component re-render");

  return (
    <div>
      <h2 className="text-2xl font-medium">React Memo & useCallback</h2>
      <button
        onClick={onIncrease}
        className="mt-3 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Click me
      </button>
    </div>
  );
}

export default memo(Content);
