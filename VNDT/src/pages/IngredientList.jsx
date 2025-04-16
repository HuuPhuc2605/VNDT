import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const IngredientList = () => {
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
    expiryDate: "",
    image: "",
  });
  const itemsPerPage = 5;

  const apiUrl = "https://67fa743d8ee14a542627bf04.mockapi.io/Lab6/VNDT";

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl);
      setIngredients(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIngredients = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    return ingredients.filter((ingredient) => {
      return (
        ingredient.name.toLowerCase().includes(lowerSearch) ||
        ingredient.productCode.toLowerCase().includes(lowerSearch) ||
        ingredient.supplier.toLowerCase().includes(lowerSearch)
      );
    });
  }, [ingredients, searchTerm]);

  const indexOfLastIngredient = currentPage * itemsPerPage;
  const indexOfFirstIngredient = indexOfLastIngredient - itemsPerPage;
  const currentIngredients = filteredIngredients.slice(
    indexOfFirstIngredient,
    indexOfLastIngredient
  );

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddIngredient = async () => {
    try {
      await axios.post(apiUrl, formData);
      fetchIngredients();
      setIsAdding(false);
      alert("Thêm sản phẩm.thành công!");
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm.");
    }
  };

  const handleEditIngredient = async () => {
    try {
      await axios.put(`${apiUrl}/${isEditing.id}`, formData);
      fetchIngredients();
      setIsEditing(null);
      alert("Cập nhật sản phẩm.thành công!");
    } catch (error) {
      alert("Lỗi khi cập nhật sản phẩm.");
    }
  };

  const handleDeleteIngredient = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xoá sản phẩm.này không?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchIngredients();
      } catch (error) {
        alert("Lỗi khi xoá sản phẩm.");
      }
    }
  };

  const startEdit = (ingredient) => {
    setIsEditing(ingredient);
    setFormData(ingredient);
  };

  const renderForm = () => (
    <div className="bg-white p-6 border rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Chỉnh sửa" : "Thêm"} sản phẩm.{" "}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={formData[key]}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={isEditing ? handleEditIngredient : handleAddIngredient}
        >
          {isEditing ? "Cập nhật" : "Thêm"}
        </button>
        <button
          className="bg-gray-300 px-4 py-2 rounded"
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-700">
        Danh sách sản phẩm.{" "}
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/2">
          <input
            type="text"
            className="w-full px-4 py-2 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-3">
            <FaSearch size={20} className="text-cyan-500" />
          </div>
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
              expiryDate: "",
              image: "",
            });
          }}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Thêm
        </button>
      </div>

      {(isAdding || isEditing) && renderForm()}

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-cyan-600 text-white text-lg">
              <th className="px-6 py-3 text-left">Hình ảnh</th>
              <th className="px-6 py-3 text-left">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left">Số lượng</th>
              <th className="px-6 py-3 text-left">Đơn vị tính</th>
              <th className="px-6 py-3 text-left">Mã sản phẩm</th>
              <th className="px-6 py-3 text-left">Nhà cung cấp</th>
              <th className="px-6 py-3 text-left">Ngày nhập kho</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentIngredients.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-red-500 py-6">
                  Không tìm thấy sản phẩm.
                </td>
              </tr>
            ) : (
              currentIngredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4">
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4">{ingredient.name}</td>
                  <td className="px-6 py-4">{ingredient.quantity}</td>
                  <td className="px-6 py-4">{ingredient.unit}</td>
                  <td className="px-6 py-4">{ingredient.productCode}</td>
                  <td className="px-6 py-4">{ingredient.supplier}</td>
                  <td className="px-6 py-4">{ingredient.expiryDate}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => startEdit(ingredient)}
                      className="text-yellow-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <nav>
          <ul className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-cyan-600 text-white"
                      : "bg-white text-cyan-600 border border-cyan-600"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default IngredientList;
