// HomePage.jsx - Phiên bản sắp xếp lại bố cục chuyên nghiệp hơn
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxes,
  FaBuilding,
  FaExchangeAlt,
  FaChartBar,
  FaBell,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import CountUp from "react-countup";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const galleryImages = [
  "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745468061/85f9295f-a4dc-4132-ae43-6c5fb21cf27e.png",
  "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745468082/c540aa6e-c2e6-4ac8-8c0a-124de9c432d7.png",
  "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745468129/93b965c3-feb1-4f01-a8fd-7dcedd9b1366.png",
];

const navButtons = [
  {
    label: "Danh sách hàng hoá",
    icon: <FaBoxes />,
    gradient: "from-pink-500 to-rose-500",
    path: "/ingredient",
    borderColor: "border-pink-500",
  },
  {
    label: "Nhà cung cấp",
    icon: <FaBuilding />,
    gradient: "from-purple-500 to-indigo-600",
    path: "/supplier",
    borderColor: "border-purple-500",
  },
  {
    label: "Nhập - Xuất kho",
    icon: <FaExchangeAlt />,
    gradient: "from-green-500 to-teal-600",
    path: "/stock",
    borderColor: "border-green-500",
  },
  {
    label: "Thống kê",
    icon: <FaChartBar />,
    gradient: "from-blue-500 to-cyan-600",
    path: "/stats",
    borderColor: "border-blue-500",
  },
  {
    label: "Thông báo",
    icon: <FaBell />,
    gradient: "from-yellow-500 to-orange-500",
    path: "/notifications",
    borderColor: "border-yellow-500",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroImages = [
    "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745596082/270d407c-1b4f-4bd2-8b6a-d8194b2eb0ea.png",
    "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745596123/6c5bfb40-ae48-482b-80b1-a167e08adcd2.png",
    "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745596161/7426b9bf-d63b-45d4-b0b4-d4607b880aee.png",
    "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745596184/f5b26bbe-84bf-4abb-9408-261867240a74.png",
    "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745596211/545d5e43-e097-4876-9700-0aa904ffdba2.png",
    "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745596243/7dc33ed8-448f-4e12-88a7-9f59c23a47e1.png",
    "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745596454/6090234e-d657-48df-82d6-a5e52e9617b9.png",
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([
    {
      title: "Cập nhật Hệ thống Quản lý Kho Hàng",
      summary:
        "Hệ thống vừa được cải tiến với tính năng cảnh báo kho hàng tự động.",
      link: "#",
      image:
        "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745478637/726473be-bf3c-4bdb-8a00-30b7be039689.png",
    },
    {
      title: "Sự kiện đặc biệt tháng 5",
      summary:
        "Tham gia sự kiện lớn nhất trong năm, nhận ngay phần thưởng hấp dẫn.",
      link: "#",
      image:
        "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745478792/7ac097f8-5e88-490c-aa20-64075a4968d8.png",
    },
    {
      title: "Khuyến mãi sốc - Giảm giá 50%",
      summary:
        "Chúng tôi đang có chương trình giảm giá đặc biệt cho tất cả các mặt hàng.",
      link: "#",
      image:
        "https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745479081/ae1434f8-0bea-434c-a599-92875739c59d.png",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://67fa743d8ee14a542627bf04.mockapi.io/Lab6/VNDT"
        );
        setIngredients(res.data);
      } catch (err) {
        console.error("Lỗi tải nguyên liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    news.forEach((item) => {
      toast(`📢 ${item.title}: ${item.summary}`, {
        icon: "📰",
        duration: 4000,
        style: {
          maxWidth: "700px",
          fontSize: "16px",
          padding: "16px 24px",
        },
      });
    });
  }, [news]);

  const stats = useMemo(() => {
    const totalProducts = ingredients.length;
    const totalQuantity = ingredients.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
    const uniqueSuppliers = new Set(ingredients.map((item) => item.supplier))
      .size;
    const stockAlerts = ingredients.filter(
      (item) => Number(item.quantity) < 10
    ).length;

    return [
      {
        label: "Tổng số sản phẩm",
        value: totalProducts,
        icon: <FaBoxes className="text-3xl text-white" />,
        gradient: "from-cyan-500 to-blue-500",
      },
      {
        label: "Tổng số lượng",
        value: totalQuantity,
        icon: <FaExchangeAlt className="text-3xl text-white" />,
        gradient: "from-green-500 to-teal-500",
      },
      {
        label: "Số nhà cung cấp",
        value: uniqueSuppliers,
        icon: <FaBuilding className="text-3xl text-white" />,
        gradient: "from-purple-500 to-indigo-500",
      },
      {
        label: "Cảnh báo tồn kho",
        value: stockAlerts,
        icon: <FaBell className="text-3xl text-white" />,
        gradient: "from-yellow-500 to-orange-500",
      },
    ];
  }, [ingredients]);

  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }, []);

  const handleNavigate = (path, label) => {
    navigate(path);
    toast.success(`Chuyển đến trang ${label}`);
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Đang tải dữ liệu...
      </div>
    );
  }
  return (
    <div className="p-6 space-y-16 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <Toaster />

      {/* Hero - phần mở đầu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <motion.img
          key={heroIndex}
          src={heroImages[heroIndex]}
          alt="Warehouse Hero"
          className="w-full h-96 object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[1px] flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-white text-5xl md:text-6xl font-bold drop-shadow-lg">
            Quản lý kho hàng thông minh
          </h1>
          <p className="text-white  text-xl md:text-xl italic">
            {greetingText}, {user?.username || "bạn"} 👋
          </p>
        </div>
      </motion.div>

      {/* Giới thiệu hệ thống */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
      >
        <img
          src="https://res.cloudinary.com/dkzpfo8b2/image/upload/v1745468331/1ff9a4fc-ba9a-4ce9-a699-32d852620979.png"
          alt="System Overview"
          className="rounded-xl w-full object-cover h-64"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Về hệ thống</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Hệ thống giúp bạn kiểm soát hàng tồn, quản lý chuỗi cung ứng, và
            theo dõi cảnh báo – tất cả trên nền tảng trực quan và hiện đại.
          </p>
        </div>
      </motion.div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`rounded-2xl shadow-xl p-6 flex items-center gap-4 bg-gradient-to-br ${item.gradient} text-white hover:shadow-2xl transform hover:scale-105 duration-300`}
          >
            {item.icon}
            <div>
              <p className="text-3xl font-bold">
                <CountUp end={item.value} duration={2} />
              </p>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tin tức */}
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Tin tức mới nhất
        </h2>
        {news.length ? (
          <div className="space-y-6">
            {news.map((item, idx) => (
              <div key={idx} className="border-b pb-6 flex space-x-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{item.summary}</p>
                  <a
                    href={item.link}
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    Đọc thêm
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Chưa có tin tức mới.</p>
        )}
      </div>

      {/* Nút điều hướng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {navButtons.map((btn, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => handleNavigate(btn.path, btn.label)}
            className={`cursor-pointer bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 flex flex-col items-center text-center space-y-2 border-2 ${btn.borderColor}`}
          >
            <div
              className={`text-4xl bg-gradient-to-br ${btn.gradient} text-white p-4 rounded-full shadow-lg`}
            >
              {btn.icon}
            </div>
            <p className="text-base font-semibold text-gray-700">{btn.label}</p>
            <span className="text-cyan-600 font-bold text-xl">→</span>
          </motion.div>
        ))}
      </div>

      {/* Bộ sưu tập ảnh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((src, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="transform hover:rotate-1 hover:scale-105 transition duration-300 shadow-xl border-4 border-white rounded-xl overflow-hidden"
          >
            <img
              src={src}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-56 object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Trích dẫn kết thúc */}
      <p className="text-center italic text-gray-700 text-lg">
        “Quản lý kho hiệu quả là chìa khoá cho chuỗi cung ứng bền vững.”
      </p>
    </div>
  );
};

export default HomePage;
