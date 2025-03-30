import { useState } from "react";

function Calculator() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState("add");

  // Hàm tính toán dựa trên phép toán đã chọn
  const calculateResult = () => {
    switch (operation) {
      case "add":
        return num1 + num2;
      case "subtract":
        return num1 - num2;
      case "multiply":
        return num1 * num2;
      case "divide":
        return num2 !== 0 ? num1 / num2 : "Không thể chia cho 0";
      default:
        return 0;
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Máy Tính Cộng Trừ Nhân Chia</h2>

      <div className="mb-2">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(Number(e.target.value))}
          className="border p-2 mr-2"
          placeholder="Nhập số 1"
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(Number(e.target.value))}
          className="border p-2"
          placeholder="Nhập số 2"
        />
      </div>

      <div className="mb-2">
        <label>
          <input
            type="radio"
            value="add"
            checked={operation === "add"}
            onChange={() => setOperation("add")}
          />
          Cộng (+)
        </label>
        <label className="ml-2">
          <input
            type="radio"
            value="subtract"
            checked={operation === "subtract"}
            onChange={() => setOperation("subtract")}
          />
          Trừ (-)
        </label>
        <label className="ml-2">
          <input
            type="radio"
            value="multiply"
            checked={operation === "multiply"}
            onChange={() => setOperation("multiply")}
          />
          Nhân (×)
        </label>
        <label className="ml-2">
          <input
            type="radio"
            value="divide"
            checked={operation === "divide"}
            onChange={() => setOperation("divide")}
          />
          Chia (÷)
        </label>
      </div>

      <h3 className="text-lg font-semibold">Kết quả: {calculateResult()}</h3>
    </div>
  );
}

export default Calculator;
