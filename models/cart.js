import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true, // giống model Order
  }
);

// Nếu model tồn tại rồi thì dùng lại, tránh lỗi hot reload
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
