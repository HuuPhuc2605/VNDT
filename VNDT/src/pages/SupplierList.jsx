import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { FaSearch, FaPlus } from "react-icons/fa";

const SupplierList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplier: "",
    supplierCode: "",
    supplierAddress: "",
    category: "",
    name: "",
    quantity: "",
  });

  const apiUrl = "https://67fa743d8ee14a542627bf04.mockapi.io/Lab6/VNDT";

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get(apiUrl);
      setIngredients(res.data);
      const grouped = groupBySupplier(res.data);
      setSuppliersData(grouped);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhà cung cấp", error);
    }
  };

  const groupBySupplier = (data) => {
    const map = {};
    data.forEach((item) => {
      const code = item.supplierCode || item.supplier;
      if (!map[code]) {
        map[code] = {
          supplier: item.supplier,
          supplierCode: item.supplierCode || code,
          supplierAddress: item.supplierAddress,
          totalQuantity: 0,
          categories: new Set(),
          productNames: [],
          raw: [],
        };
      }
      map[code].totalQuantity += parseInt(item.quantity);
      map[code].categories.add(item.category);
      map[code].productNames.push(item.name);
      map[code].raw.push(item);
    });

    return Object.values(map);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData({
      supplier: "",
      supplierCode: "",
      supplierAddress: "",
      category: "",
      name: "",
      quantity: "",
    });
    setEditingSupplier(null);
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    const firstProduct = supplier.raw[0];
    setFormData(firstProduct);
    setEditingSupplier(firstProduct);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingSupplier) {
        await axios.put(`${apiUrl}/${editingSupplier.id}`, formData);
        alert("Cập nhật thông tin nhà cung cấp thành công!");
      } else {
        await axios.post(apiUrl, formData);
        alert("Thêm thông tin nhà cung cấp thành công!");
      }
      setShowModal(false);
      fetchIngredients();
    } catch (error) {
      alert(" Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  const handleDelete = async (supplier) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá nhà cung cấp này?");
    if (!confirm) return;

    try {
      await Promise.all(
        supplier.raw.map((item) => axios.delete(`${apiUrl}/${item.id}`))
      );
      alert("Đã xoá nhà cung cấp thành công!");
      fetchIngredients();
    } catch (error) {
      alert("Có lỗi khi xoá.");
    }
  };

  const filteredSuppliers = suppliersData.filter((s) =>
    s.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-700">
          Danh sách Nhà Cung Cấp
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder=" Tìm theo tên nhà cung cấp..."
            className="w-full px-4 py-2 border border-cyan-400 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-3 text-cyan-500">
            <FaSearch size={18} />
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap"
        >
          <FaPlus size={18} /> Thêm nhà cung cấp
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 relative"
          >
            <h2 className="text-xl font-bold text-teal-600 mb-2">
              🏢 {supplier.supplier}
            </h2>
            <p>
              <strong>Mã nhà cung cấp:</strong> {supplier.supplierCode}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {supplier.supplierAddress}
            </p>
            <p>
              <strong>Tổng số lượng hàng:</strong> {supplier.totalQuantity}
            </p>
            <p>
              <strong>Danh mục sản phẩm:</strong>{" "}
              {[...supplier.categories].join(", ")}
            </p>
            <div className="mt-2">
              <strong>Sản phẩm đã nhập:</strong>
              <ul className="list-disc ml-5 text-gray-700 mt-1">
                {supplier.productNames.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => openEditModal(supplier)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(supplier)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {filteredSuppliers.length === 0 && (
          <p className="text-center col-span-full text-gray-400">
            Không tìm thấy nhà cung cấp nào.
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-700">
              {editingSupplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
            </h2>
            <div className="space-y-4">
              {[
                { label: "Tên nhà cung cấp", name: "supplier" },
                { label: "Mã nhà cung cấp", name: "supplierCode" },
                { label: "Địa chỉ", name: "supplierAddress" },
                { label: "Danh mục (category)", name: "category" },
                { label: "Tên sản phẩm", name: "name" },
                { label: "Số lượng", name: "quantity", type: "number" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-cyan-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-cyan-700"
              >
                {editingSupplier ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
