"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { FaSearch, FaFileExport, FaFileImport } from "react-icons/fa"
import { X } from "lucide-react"
import { useNotifications } from "../context/NotificationContext"

const StockManager = () => {
  const { addNotification } = useNotifications()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [currentOperation, setCurrentOperation] = useState(null)

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const apiUrl = "https://67fa743d8ee14a542627bf04.mockapi.io/Lab6/VNDT"

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get(apiUrl)
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSupplier = selectedSupplier === "" || product.supplier === selectedSupplier
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory

      return matchesSearch && matchesSupplier && matchesCategory
    })
  }, [products, searchTerm, selectedSupplier, selectedCategory])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const openImportModal = (product = null) => {
    if (product) {
      setFormData({
        productId: product.id,
        productName: product.name,
        quantity: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    } else {
      setFormData({
        productId: "",
        productName: "",
        quantity: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    }
    setCurrentOperation("import")
    setShowImportModal(true)
  }

  const openExportModal = (product = null) => {
    if (product) {
      setFormData({
        productId: product.id,
        productName: product.name,
        quantity: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    } else {
      setFormData({
        productId: "",
        productName: "",
        quantity: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    }
    setCurrentOperation("export")
    setShowExportModal(true)
  }

  const handleStockOperation = async () => {
    if (!formData.productId || !formData.quantity || Number.parseInt(formData.quantity) <= 0) {
      alert("Vui lòng chọn sản phẩm và nhập số lượng hợp lệ")
      return
    }

    try {
      // Tìm sản phẩm trong danh sách
      const product = products.find((p) => p.id === formData.productId)
      if (!product) {
        alert("Không tìm thấy sản phẩm")
        return
      }

      // Cập nhật số lượng
      let newQuantity
      if (currentOperation === "import") {
        newQuantity = Number.parseInt(product.quantity) + Number.parseInt(formData.quantity)
      } else {
        // Kiểm tra số lượng xuất không vượt quá tồn kho
        if (Number.parseInt(formData.quantity) > Number.parseInt(product.quantity)) {
          alert("Số lượng xuất không thể vượt quá số lượng tồn kho")
          return
        }
        newQuantity = Number.parseInt(product.quantity) - Number.parseInt(formData.quantity)
      }

      // Cập nhật sản phẩm
      await axios.put(`${apiUrl}/${product.id}`, { ...product, quantity: newQuantity.toString() })

      // Thông báo
      addNotification(
        `Đã ${currentOperation === "import" ? "nhập" : "xuất"} ${formData.quantity} ${product.unit} ${
          product.name
        } thành công`,
      )

      // Đóng modal và làm mới dữ liệu
      setShowImportModal(false)
      setShowExportModal(false)
      fetchProducts()
    } catch (error) {
      console.error("Error updating stock", error)
      alert("Có lỗi xảy ra khi cập nhật kho")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-700">Quản lý nhập - xuất kho</h1>

      {/* Thanh tìm kiếm và lọc */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Tìm theo tên hoặc mã sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-3 text-cyan-500">
            <FaSearch size={18} />
          </div>
        </div>

        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="px-4 py-2 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Tất cả nhà cung cấp</option>
          {Array.from(new Set(products.map((item) => item.supplier))).map((supplier, idx) => (
            <option key={idx} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Tất cả danh mục</option>
          {Array.from(new Set(products.map((item) => item.category))).map((category, idx) => (
            <option key={idx} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Nút nhập/xuất kho */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => openImportModal()}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaFileImport /> Nhập kho
        </button>
        <button
          onClick={() => openExportModal()}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          <FaFileExport /> Xuất kho
        </button>
      </div>

      {/* Bảng sản phẩm */}
      <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-cyan-600 text-white text-lg">
              <th className="px-6 py-3 text-left">Hình ảnh</th>
              <th className="px-6 py-3 text-left">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left">Mã SP</th>
              <th className="px-6 py-3 text-left">Tồn kho</th>
              <th className="px-6 py-3 text-left">Đơn vị</th>
              <th className="px-6 py-3 text-left">Nhà cung cấp</th>
              <th className="px-6 py-3 text-left">Danh mục</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-red-500 py-6">
                  Không tìm thấy sản phẩm
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.productCode}</td>
                  <td className="px-6 py-4 font-bold">{product.quantity}</td>
                  <td className="px-6 py-4">{product.unit}</td>
                  <td className="px-6 py-4">{product.supplier}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openImportModal(product)}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Nhập
                      </button>
                      <button
                        onClick={() => openExportModal(product)}
                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                      >
                        Xuất
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal nhập kho */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-700">Nhập kho</h2>
              <button onClick={() => setShowImportModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Sản phẩm</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={formData.productId !== ""}
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.productCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ngày nhập</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleStockOperation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Xác nhận nhập kho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xuất kho */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-700">Xuất kho</h2>
              <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Sản phẩm</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={formData.productId !== ""}
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.productCode}) - Tồn kho: {product.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  min="1"
                  max={formData.productId ? products.find((p) => p.id === formData.productId)?.quantity : undefined}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ngày xuất</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleStockOperation}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Xác nhận xuất kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockManager
