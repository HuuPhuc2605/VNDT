import { useMemo, useState } from "react";

function UseMemoComponent() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);

  const handleSubmit = () => {
    if (!name || !price) return;
    setProducts([
      ...products,
      {
        name,
        price: +price,
      },
    ]);
    setName(""); // Reset input sau khi thêm
    setPrice("");
  };

  const total = useMemo(() => {
    const result = products.reduce((total, prod) => total + prod.price, 0);
    console.log("Tính toán lại tổng tiền");
    return result;
  }, [products]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Quản lý sản phẩm
      </h1>

      {/* Input nhập tên */}
      <input
        value={name}
        placeholder="Nhập tên sản phẩm..."
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Input nhập giá */}
      <input
        value={price}
        placeholder="Nhập giá..."
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Nút thêm sản phẩm */}
      <button
        onClick={handleSubmit}
        className="w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
      >
        Thêm sản phẩm
      </button>

      {/* Hiển thị tổng tiền */}
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Tổng tiền: <span className="text-blue-500">{total} VNĐ</span>
      </p>

      {/* Danh sách sản phẩm */}
      <ul className="mt-4 space-y-2">
        {products.map((product, index) => (
          <li
            key={index}
            className="p-2 bg-gray-100 rounded-md flex justify-between items-center"
          >
            <span className="font-medium">{product.name}</span>
            <span className="text-green-500">{product.price} VNĐ</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UseMemoComponent;
