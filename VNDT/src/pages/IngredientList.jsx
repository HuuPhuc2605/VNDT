import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const IngredientList = () => {
  const { addNotification } = useNotifications();

  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    productCode: "",
    supplier: "",
    category: "",
    entryDate: "",
    image: "",
  });
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const itemsPerPage = 6;

  const apiUrl = "https://67fa743d8ee14a542627bf04.mockapi.io/Lab6/VNDT";

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl);
      setIngredients(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const filteredIngredients = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    return ingredients.filter((ingredient) => {
      const matchesSearch =
        ingredient.name.toLowerCase().includes(lowerSearch) ||
        ingredient.productCode.toLowerCase().includes(lowerSearch);
      const matchesSupplier =
        !selectedSupplier || ingredient.supplier === selectedSupplier;
      const matchesCategory =
        !selectedCategory || ingredient.category === selectedCategory;
      return matchesSearch && matchesSupplier && matchesCategory;
    });
  }, [ingredients, searchTerm, selectedSupplier, selectedCategory]);

  const indexOfLastIngredient = currentPage * itemsPerPage;
  const indexOfFirstIngredient = indexOfLastIngredient - itemsPerPage;
  const currentIngredients = filteredIngredients.slice(
    indexOfFirstIngredient,
    indexOfLastIngredient
  );
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddIngredient = async () => {
    try {
      await axios.post(apiUrl, formData);
      fetchIngredients();
      setIsAdding(false);
      alert("Thêm sản phẩm thành công!");
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  const handleEditIngredient = async () => {
    try {
      await axios.put(`${apiUrl}/${isEditing.id}`, formData);
      fetchIngredients();
      setIsEditing(null);
      alert("Cập nhật sản phẩm thành công!");
    } catch (error) {
      alert("Lỗi khi cập nhật sản phẩm");
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchIngredients();
      } catch (error) {
        alert("Lỗi khi xoá sản phẩm");
      }
    }
  };

  const startEdit = (ingredient) => {
    setIsEditing(ingredient);
    setFormData(ingredient);
  };

  const renderForm = () => (
    <div className="bg-white p-8 border rounded-2xl shadow-xl my-8">
      <h2 className="text-2xl font-bold mb-6 text-cyan-700">
        {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              {key === "productCode"
                ? "Mã sản phẩm"
                : key === "entryDate"
                ? "Ngày nhập"
                : key === "quantity"
                ? "Số lượng"
                : key === "unit"
                ? "Đơn vị"
                : key === "image"
                ? "Hình ảnh (URL)"
                : key === "name"
                ? "Tên sản phẩm"
                : key === "supplier"
                ? "Nhà cung cấp"
                : key === "category"
                ? "Danh mục"
                : key}
            </label>
            <input
              name={key}
              placeholder={(() => {
                switch (key) {
                  case "productCode":
                    return "Nhập mã sản phẩm";
                  case "entryDate":
                    return "Chọn ngày nhập";
                  case "quantity":
                    return "Nhập số lượng";
                  case "unit":
                    return "Nhập đơn vị";
                  case "image":
                    return "Nhập URL hình ảnh";
                  case "name":
                    return "Nhập tên sản phẩm";
                  case "supplier":
                    return "Nhập tên nhà cung cấp";
                  case "category":
                    return "Nhập danh mục";
                  default:
                    return "Nhập thông tin";
                }
              })()}
              value={formData[key]}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              type={
                key === "entryDate"
                  ? "date"
                  : key === "quantity"
                  ? "number"
                  : "text"
              }
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-4 ">
        <button
          className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded hover:bg-teal-700"
          onClick={isEditing ? handleEditIngredient : handleAddIngredient}
        >
          {isEditing ? "Cập nhật" : "Thêm mới"}
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-lg"
          onClick={() => {
            setIsAdding(false);
            setIsEditing(null);
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 pb-12">
      <h1 className="text-3xl font-bold text-cyan-700 text-center">
        Danh Sách Sản Phẩm
      </h1>

      {/* Bộ lọc tìm kiếm */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-col md:flex-row md:gap-4 flex-1">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              className="w-full px-4 py-2 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Tìm theo tên hoặc mã sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="absolute right-3 top-3 text-cyan-500">
              <FaSearch size={18} />
            </div>
          </div>

          <select
            value={selectedSupplier}
            onChange={(e) => {
              setSelectedSupplier(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-60 px-4 py-2 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Tất cả nhà cung cấp</option>
            {Array.from(new Set(ingredients.map((item) => item.supplier))).map(
              (supplier, idx) => (
                <option key={idx} value={supplier}>
                  {supplier}
                </option>
              )
            )}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-48 px-4 py-2 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Tất cả danh mục</option>
            {Array.from(new Set(ingredients.map((item) => item.category))).map(
              (category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        <button
          onClick={() => {
            setIsAdding(true);
            setFormData({
              name: "",
              quantity: "",
              unit: "",
              productCode: "",
              supplier: "",
              category: "",
              entryDate: "",
              image: "",
            });
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 whitespace-nowrap"
        >
          <FaPlus className="inline mr-2" /> Thêm sản phẩm
        </button>
      </div>

      {/* Hiển thị form nếu đang thêm hoặc sửa */}
      {isAdding || isEditing ? renderForm() : null}

      {/* Danh sách sản phẩm dạng thẻ */}
      <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {currentIngredients.length === 0 ? (
          <div className="col-span-full text-center text-red-500 text-lg font-semibold">
            Không tìm thấy sản phẩm phù hợp
          </div>
        ) : (
          currentIngredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="relative bg-white p-5 pb-20 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 border border-cyan-100"
            >
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="w-64 h-90 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-cyan-700 mb-1 ">
                {ingredient.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Mã sản phẩm: {ingredient.productCode}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Số lượng: {ingredient.quantity} {ingredient.unit}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Danh mục: {ingredient.category}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Nhà cung cấp: {ingredient.supplier}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Ngày nhập: {ingredient.entryDate}
              </p>

              {/* Nút cố định dưới */}
              <div className="absolute bottom-4 left-5 right-5 flex gap-3">
                <button
                  onClick={() => startEdit(ingredient)}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:brightness-110 text-white px-3 py-2 rounded-lg shadow"
                >
                  <Pencil className="inline mr-1" size={16} /> Sửa
                </button>
                <button
                  onClick={() => handleDeleteIngredient(ingredient.id)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-400 hover:brightness-110 text-white px-3 py-2 rounded-lg shadow"
                >
                  <Trash2 className="inline mr-1" size={16} /> Xoá
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      <div className="mt-10 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              currentPage === index + 1
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IngredientList;
