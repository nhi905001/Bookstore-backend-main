import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/user.js";
import Product from "./models/product.js";
import Order from "./models/order.js";

dotenv.config();

const books = [
  {
    name: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    description: "Cuốn sách dạy cách giao tiếp và ứng xử với mọi người.",
    price: 120000,
    salePrice: 96000,
    category: "Tự phát triển",
    publisher: "NXB Trẻ",
    publishedYear: 2020,
    pageCount: 320,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    rating: 4.8,
    reviewCount: 1250,
    featured: true,
    bestseller: true,
  },
  {
    name: "Nhà Giả Kim",
    author: "Paulo Coelho",
    description:
      "Câu chuyện về hành trình tìm kiếm kho báu của một cậu bé chăn cừu.",
    price: 95000,
    category: "Tiểu thuyết",
    publisher: "NXB Hội Nhà Văn",
    publishedYear: 2021,
    pageCount: 200,
    stock: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    rating: 4.7,
    reviewCount: 980,
    featured: true,
    bestseller: true,
  },
  {
    name: "Tội Ác và Hình Phạt",
    author: "Fyodor Dostoevsky",
    description:
      "Một trong những tác phẩm vĩ đại nhất của văn học Nga, khám phá tâm lý tội phạm.",
    price: 160000,
    category: "Tiểu thuyết",
    publisher: "NXB Văn Học",
    publishedYear: 2018,
    pageCount: 600,
    stock: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    rating: 4.9,
    reviewCount: 1800,
    featured: false,
    bestseller: true,
  },
  {
    name: "Harry Potter và Hòn Đá Phù Thủy",
    author: "J.K. Rowling",
    description:
      "Tập đầu tiên trong series truyện fantasy nổi tiếng về cậu bé phù thủy Harry Potter.",
    price: 135000,
    category: "Fantasy",
    publisher: "NXB Trẻ",
    publishedYear: 2017,
    pageCount: 350,
    stock: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1612969308146-066d55f37ccb?w=400",
    rating: 4.9,
    reviewCount: 5000,
    featured: true,
    bestseller: true,
  },
  {
    name: "Chúa Tể Của Những Chiếc Nhẫn",
    author: "J.R.R. Tolkien",
    description:
      "Bộ tiểu thuyết fantasy kinh điển về cuộc hành trình tiêu diệt Chiếc Nhẫn Quyền Lực.",
    price: 450000,
    category: "Fantasy",
    publisher: "NXB Văn Học",
    publishedYear: 2019,
    pageCount: 1200,
    stock: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1509266272358-77a158d5209e?w=400",
    rating: 4.9,
    reviewCount: 4500,
    featured: true,
    bestseller: false,
  },
  {
    name: "Để Xây Dựng Doanh Nghiệp Hiệu Quả",
    author: "Michael E. Gerber",
    description:
      "Cuốn sách phải đọc cho bất kỳ ai muốn xây dựng một doanh nghiệp thành công và bền vững.",
    price: 145000,
    category: "Kinh doanh",
    publisher: "NXB Tổng Hợp TP.HCM",
    publishedYear: 2021,
    pageCount: 280,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400",
    rating: 4.6,
    reviewCount: 750,
    featured: false,
    bestseller: false,
  },
  {
    name: "Tư Duy Nhanh và Chậm",
    author: "Daniel Kahneman",
    description:
      "Khám phá hai hệ thống tư duy điều khiển cách chúng ta suy nghĩ.",
    price: 175000,
    category: "Tâm lý học",
    publisher: "NXB Trẻ",
    publishedYear: 2020,
    pageCount: 550,
    stock: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1593340573147-6998b5485f54?w=400",
    rating: 4.8,
    reviewCount: 1900,
    featured: true,
    bestseller: true,
  },
  {
    name: "1984",
    author: "George Orwell",
    description:
      "Tiểu thuyết kinh điển về một xã hội toàn trị trong tương lai.",
    price: 115000,
    category: "Tiểu thuyết",
    publisher: "NXB Văn Học",
    publishedYear: 2019,
    pageCount: 328,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    rating: 4.7,
    reviewCount: 2200,
    featured: false,
    bestseller: true,
  },
  {
    name: "Hoàng Tử Bé",
    author: "Antoine de Saint-Exupéry",
    description:
      "Câu chuyện triết lý dành cho mọi lứa tuổi về tình bạn, tình yêu và sự mất mát.",
    price: 65000,
    category: "Thiếu nhi",
    publisher: "NXB Hội Nhà Văn",
    publishedYear: 2018,
    pageCount: 96,
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1544716278-e513176f20b5?w=400",
    rating: 4.8,
    reviewCount: 3500,
    featured: false,
    bestseller: false,
  },
  {
    name: "Vũ Trụ Trong Vỏ Hạt Dẻ",
    author: "Stephen Hawking",
    description:
      "Khám phá những bí ẩn của vũ trụ từ các lý thuyết vật lý hiện đại.",
    price: 155000,
    category: "Khoa học",
    publisher: "NXB Trẻ",
    publishedYear: 2019,
    pageCount: 224,
    stock: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1529167182942-85093550983b?w=400",
    rating: 4.7,
    reviewCount: 950,
    featured: false,
    bestseller: false,
  },
  {
    name: "Giết Con Chim Nhại",
    author: "Harper Lee",
    description:
      "Tiểu thuyết kinh điển của văn học Mỹ về nạn phân biệt chủng tộc và sự bất công.",
    price: 125000,
    category: "Tiểu thuyết",
    publisher: "NXB Văn Học",
    publishedYear: 2020,
    pageCount: 384,
    stock: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a4?w=400",
    rating: 4.8,
    reviewCount: 1600,
    featured: false,
    bestseller: true,
  },
  {
    name: "Trăm Năm Cô Đơn",
    author: "Gabriel García Márquez",
    description:
      "Một trong những tác phẩm quan trọng nhất của thế kỷ 20, thuộc thể loại hiện thực huyền ảo.",
    price: 185000,
    category: "Tiểu thuyết",
    publisher: "NXB Hội Nhà Văn",
    publishedYear: 2018,
    pageCount: 417,
    stock: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
    rating: 4.8,
    reviewCount: 2500,
    featured: false,
    bestseller: true,
  },
  {
    name: "Những Người Khốn Khổ",
    author: "Victor Hugo",
    description: "Bộ tiểu thuyết vĩ đại về xã hội Pháp thế kỷ 19.",
    price: 350000,
    category: "Tiểu thuyết",
    publisher: "NXB Văn Học",
    publishedYear: 2017,
    pageCount: 1400,
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1516410529446-2c777cb736e6?w=400",
    rating: 4.9,
    reviewCount: 3000,
    featured: false,
    bestseller: false,
  },
  {
    name: "Rừng Na Uy",
    author: "Haruki Murakami",
    description:
      "Câu chuyện tình yêu và sự mất mát của những người trẻ ở Tokyo những năm 1960.",
    price: 130000,
    category: "Tiểu thuyết",
    publisher: "NXB Hội Nhà Văn",
    publishedYear: 2019,
    pageCount: 400,
    stock: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1495640452828-3df679536e20?w=400",
    rating: 4.7,
    reviewCount: 1800,
    featured: true,
    bestseller: true,
  },
  {
    name: "Cuộc Sống Không Giới Hạn",
    author: "Nick Vujicic",
    description:
      "Câu chuyện truyền cảm hứng của người đàn ông không tay không chân.",
    price: 105000,
    category: "Tự phát triển",
    publisher: "NXB Tổng Hợp TP.HCM",
    publishedYear: 2018,
    pageCount: 272,
    stock: 55,
    imageUrl:
      "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=400",
    rating: 4.8,
    reviewCount: 1400,
    featured: false,
    bestseller: true,
  },
];

// Dữ liệu user mẫu
const users = [
  {
    name: "Admin User",
    email: "admin@bookstore.com",
    password: "admin123",
    isAdmin: true,
    role: "admin",
  },
  {
    name: "Nguyễn Văn A",
    email: "user@bookstore.com",
    password: "user123",
    isAdmin: false,
    role: "user",
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Đã xóa dữ liệu cũ...");

    // Tạo users (dùng create để kích hoạt middleware hash password)
    const createdUsers = [];
    for (const userData of users) {
      const createdUser = await User.create(userData);
      createdUsers.push(createdUser);
    }
    console.log(`Đã tạo ${createdUsers.length} users...`);

    // Tạo products
    const createdProducts = await Product.insertMany(books);
    console.log(`Đã tạo ${createdProducts.length} sách...`);

    console.log("✅ Dữ liệu đã được import thành công!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi khi import dữ liệu:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("✅ Dữ liệu đã được xóa!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi khi xóa dữ liệu:", error);
    process.exit(1);
  }
};

// Chạy seeder
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
