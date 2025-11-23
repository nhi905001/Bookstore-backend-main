import mongoose from 'mongoose';

/**
 * Product Model - Lưu thông tin sách
 * Đã được cập nhật với các trường mới từ bookstore-complete
 */
const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Vui lòng nhập tên sách'],
      trim: true,
    },
    author: { 
      type: String, 
      required: [true, 'Vui lòng nhập tác giả'],
      trim: true,
    },
    description: { 
      type: String, 
      required: [true, 'Vui lòng nhập mô tả'],
    },
    price: { 
      type: Number, 
      required: [true, 'Vui lòng nhập giá'],
      min: [0, 'Giá phải lớn hơn 0'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Giá khuyến mãi phải lớn hơn 0'],
    },
    imageUrl: { 
      type: String, 
      required: [true, 'Vui lòng thêm ảnh bìa'],
    },
    category: { 
      type: String, 
      required: [true, 'Vui lòng chọn thể loại'],
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Năm xuất bản không hợp lệ'],
      max: [new Date().getFullYear() + 1, 'Năm xuất bản không hợp lệ'],
    },
    pageCount: {
      type: Number,
      min: [1, 'Số trang phải lớn hơn 0'],
    },
    stock: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng tồn kho'],
      min: [0, 'Số lượng tồn kho không được âm'],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Đánh giá phải từ 0 đến 5'],
      max: [5, 'Đánh giá phải từ 0 đến 5'],
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh hơn
productSchema.index({ name: 'text', author: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestseller: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
