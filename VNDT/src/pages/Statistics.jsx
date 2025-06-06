"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaChartPie, FaChartBar } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";
import { FaBuilding, FaBoxOpen } from "react-icons/fa";

const Statistics = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { addNotification } = useNotifications();

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

  // Tính toán các thống kê
  const stats = useMemo(() => {
    if (!ingredients.length) return null;

    // Tổng số sản phẩm
    const totalProducts = ingredients.length;

    // Tổng số lượng
    const totalQuantity = ingredients.reduce(
      (sum, item) => sum + Number.parseInt(item.quantity || 0),
      0
    );

    // Số lượng nhà cung cấp
    const uniqueSuppliers = new Set(ingredients.map((item) => item.supplier))
      .size;

    // Số lượng danh mục
    const uniqueCategories = new Set(ingredients.map((item) => item.category))
      .size;

    // Dữ liệu cho biểu đồ theo danh mục
    const categoryData = [];
    const categoryMap = {};

    ingredients.forEach((item) => {
      if (!item.category) return;

      if (!categoryMap[item.category]) {
        categoryMap[item.category] = {
          name: item.category,
          value: 0,
        };
        categoryData.push(categoryMap[item.category]);
      }

      categoryMap[item.category].value += Number.parseInt(item.quantity || 0);
    });

    // Dữ liệu cho biểu đồ theo nhà cung cấp
    const supplierData = [];
    const supplierMap = {};

    ingredients.forEach((item) => {
      if (!item.supplier) return;

      if (!supplierMap[item.supplier]) {
        supplierMap[item.supplier] = {
          name: item.supplier,
          value: 0,
        };
        supplierData.push(supplierMap[item.supplier]);
      }

      supplierMap[item.supplier].value += Number.parseInt(item.quantity || 0);
    });

    // Tính tổng số lượng cho biểu đồ phần trăm
    const totalCategoryQuantity = categoryData.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const totalSupplierQuantity = supplierData.reduce(
      (sum, item) => sum + item.value,
      0
    );

    // Thêm phần trăm vào dữ liệu
    categoryData.forEach((item) => {
      item.percentage = totalCategoryQuantity
        ? ((item.value / totalCategoryQuantity) * 100).toFixed(1)
        : 0;
    });

    supplierData.forEach((item) => {
      item.percentage = totalSupplierQuantity
        ? ((item.value / totalSupplierQuantity) * 100).toFixed(1)
        : 0;
    });

    return {
      totalProducts,
      totalQuantity,
      uniqueSuppliers,
      uniqueCategories,
      categoryData,
      supplierData,
    };
  }, [ingredients]);

  // Màu sắc cho biểu đồ
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#83a6ed",
    "#8dd1e1",
  ];

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
        Thống kê
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "overview" ? "bg-cyan-600 text-white" : "bg-gray-200"
          }`}
        >
          <FaChartPie /> Tổng quan
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "categories"
              ? "bg-cyan-600 text-white"
              : "bg-gray-200"
          }`}
        >
          <FaChartPie /> Theo danh mục
        </button>
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === "suppliers" ? "bg-cyan-600 text-white" : "bg-gray-200"
          }`}
        >
          <FaChartBar /> Theo nhà cung cấp
        </button>
      </div>

      {/* Nội dung tab */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {activeTab === "overview" && stats && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-700">
              Tổng quan kho hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Thẻ thống kê */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Tổng số sản phẩm</p>
                    <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <FaBoxOpen className="text-4xl opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Tổng số lượng</p>
                    <p className="text-3xl font-bold">{stats.totalQuantity}</p>
                  </div>
                  <FaBoxOpen className="text-4xl opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Số nhà cung cấp</p>
                    <p className="text-3xl font-bold">
                      {stats.uniqueSuppliers}
                    </p>
                  </div>
                  <FaBuilding className="text-4xl opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Số danh mục</p>
                    <p className="text-3xl font-bold">
                      {stats.uniqueCategories}
                    </p>
                  </div>
                  <FaChartPie className="text-4xl opacity-80" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Biểu đồ phần trăm theo danh mục */}
              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4 text-cyan-700">
                  Phân bố theo danh mục
                </h3>
                <div className="space-y-4">
                  {stats.categoryData.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{item.name}</span>
                        <span>
                          {item.percentage}% ({item.value})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="h-4 rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biểu đồ phần trăm theo nhà cung cấp */}
              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4 text-cyan-700">
                  Phân bố theo nhà cung cấp
                </h3>
                <div className="space-y-4">
                  {stats.supplierData.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{item.name}</span>
                        <span>
                          {item.percentage}% ({item.value})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="h-4 rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && stats && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-700">
              Thống kê theo danh mục
            </h2>
            <div className="space-y-6">
              {stats.categoryData.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-lg font-bold">
                      {item.value} sản phẩm
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className="h-6 rounded-full flex items-center justify-end px-3 text-white font-medium"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "suppliers" && stats && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-700">
              Thống kê theo nhà cung cấp
            </h2>
            <div className="space-y-6">
              {stats.supplierData.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-lg font-bold">
                      {item.value} sản phẩm
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className="h-6 rounded-full flex items-center justify-end px-3 text-white font-medium"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
