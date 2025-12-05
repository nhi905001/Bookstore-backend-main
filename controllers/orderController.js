import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipping",
  "delivered",
  "cancelled",
];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  }

  if (!shippingAddress?.phone) {
    return res.status(400).json({ message: "Số điện thoại là bắt buộc" });
  }

  try {
    const order = new Order({
      orderItems: orderItems.map((item) => ({ ...item })),
      user: req.user._id,
      shippingAddress,
      totalPrice,
      statusHistory: [
        {
          status: "pending",
          note: "Đơn hàng đã được tạo",
          updatedAt: new Date(),
        },
      ],
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate("user", "id name email")
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get specific order
// @route   GET /api/orders/:id
// @access  Private (owner) / Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (
        !req.user.isAdmin &&
        order.user.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to view this order" });
      }

      await order.populate("user", "name email");
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const adjustInventory = async (increase = false) => {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (!product) continue;

          if (increase) {
            product.stock += item.quantity;
          } else {
            product.stock = Math.max(product.stock - item.quantity, 0);
          }

          await product.save();
        }
      };

      order.orderStatus = status;
      if (status === "delivered") {
        if (!order.stockDeducted) {
          await adjustInventory(false);
          order.stockDeducted = true;
        }
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status === "cancelled") {
        if (order.stockDeducted) {
          await adjustInventory(true);
          order.stockDeducted = false;
        }
        order.isDelivered = false;
        order.deliveredAt = undefined;
      }

      order.statusHistory = order.statusHistory || [];
      order.statusHistory.push({
        status,
        note,
        updatedAt: new Date(),
      });

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Revenue summary for dashboard
// @route   GET /api/orders/stats/summary
// @access  Private/Admin
const getRevenueSummary = async (req, res) => {
  try {
    const monthsParam = Number(req.query.months) || 6;
    const months = monthsParam > 0 ? monthsParam : 6;

    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1),
      1
    );

    const [monthlyData, totals, totalUsers, totalProducts] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      User.countDocuments(),
      Product.countDocuments(),
    ]);

    const monthlyMap = new Map(
      monthlyData.map((item) => {
        const key = `${item._id.year}-${item._id.month}`;
        return [
          key,
          {
            label: `${item._id.month.toString().padStart(2, "0")}/${
              item._id.year
            }`,
            month: item._id.month,
            year: item._id.year,
            revenue: item.revenue,
            orders: item.orders,
          },
        ];
      })
    );

    const filledMonthly = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (monthlyMap.has(key)) {
        filledMonthly.push(monthlyMap.get(key));
      } else {
        filledMonthly.push({
          label: `${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          revenue: 0,
          orders: 0,
        });
      }
    }

    const summaryTotals = totals[0] || { totalRevenue: 0, totalOrders: 0 };

    res.json({
      totalRevenue: summaryTotals.totalRevenue,
      totalOrders: summaryTotals.totalOrders,
      totalUsers,
      totalProducts,
      monthlyRevenue: filledMonthly,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getRevenueSummary,
};
