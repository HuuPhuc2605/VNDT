import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#003f70] text-white py-6 text-sm mt-10">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Giới thiệu & logo */}
        <div>
          <img
            src="https://res.cloudinary.com/dkzpfo8b2/image/upload/v1744819280/logo_fgovjl.png"
            alt="VNDT Logo"
            className="w-20 mb-3"
          />
          <p className="mb-2 leading-snug">
            Tại VNDT, chúng tôi cung cấp giải pháp giúp doanh nghiệp chuyển đổi số và nâng cao hiệu quả hoạt động kinh doanh thông qua công nghệ.
          </p>
          <p className="flex items-center gap-2">📞 Tel/Fax: 84 - 28 - 38339966</p>
          <p className="flex items-center gap-2">📧 Email: info@vndt.com</p>
        </div>

        {/* Sản phẩm */}
        <div>
          <h3 className="font-bold mb-2">SẢN PHẨM</h3>
          <ul className="space-y-1">
            <li>VNDT ERP</li>
            <li>VNDT POS</li>
            <li>VNDT CRM</li>
            <li>VNDT WMS</li>
            <li>VNDT HRM</li>
          </ul>
        </div>

        {/* Chuyên đề */}
        <div>
          <h3 className="font-bold mb-2">CHUYÊN ĐỀ</h3>
          <ul className="space-y-1">
            <li>Chuyển đổi số</li>
            <li>Quản lý vận hành</li>
            <li>Chuỗi cung ứng</li>
          </ul>
        </div>

        {/* Kết nối */}
        <div>
          <h3 className="font-bold mb-2">KẾT NỐI VỚI CHÚNG TÔI</h3>
          <div className="flex gap-4 text-xl">
            <a href="https://facebook.com" className="hover:text-blue-300">📘</a>
            <a href="https://youtube.com" className="hover:text-red-400">▶️</a>
            <a href="mailto:info@vndt.com" className="hover:text-yellow-300">✉️</a>
          </div>
          <img
            src="https://images.dmca.com/Badges/dmca_protected_16_120.png?ID=someid"
            alt="DMCA"
            className="mt-4 w-24"
          />
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-gray-300">
        © {new Date().getFullYear()} VNDT. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
