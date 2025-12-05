import Cart from "../models/cart.js";
import Product from "../models/product.js";

/**
 * @desc   Get cart of logged-in user
 * @route  GET /api/cart
 * @access Private
 */

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc   Add item to cart (create cart if none exists)
 * @route  POST /api/cart/add
 * @access Private
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    // Lấy thông tin product từ DB
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });

    const itemData = {
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity,
    };

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [itemData],
      });
    } else {
      const item = cart.items.find((i) => i.product.toString() === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push(itemData);
      }
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc   Update quantity of a cart item
 * @route  PUT /api/cart/update/:productId
 * @access Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc   Remove a single item from cart
 * @route  DELETE /api/cart/remove/:productId
 * @access Private
 */
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    const updatedCart = await cart.save();

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc   Clear entire cart
 * @route  DELETE /api/cart/clear
 * @access Private
 */
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } }
    );

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
