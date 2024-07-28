const { httpGetOne, httpGetAll, httpPut, httpDelete, httpPost } = require('../helpers/httpMethods');
const { isAdmin } = require('../middleware/role-guard.middleware');
const { isAuthenticated } = require('../middleware/route-guard.middleware');
const Order = require('../models/Order.models')
const router = require("express").Router()

// fetch all orders from all users (only admin)
router.get('/', isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const ordersData = await Order.find()
        .sort({createdAt: -1}
        )
        .populate('userId', '_id address');
 
        res.json(ordersData);
    } catch (error) {
        next(error);
    }
})

// place a new order
router.post('/', isAuthenticated, async (req, res, next) => { 
    const {userId, role} = req.tokenPayload;
    if (role === 'admin') {
        return res.status(400).json({ message: 'Bad request: admin can not place na order' });
    }

    req.body.userId = userId;
    httpPost(Order, req, res, next);
  
});

// get a particular order details
router.get('/:orderId', isAuthenticated, async (req, res, next) => {
    const { orderId } = req.params;
    const { userId, role } = req.tokenPayload.role;
    const orderToEdit = await Order.findById(orderId);
   
    // platform admin or user who placed order can view orders history
    if (role !== "admin" || orderToEdit.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only access your orders' });
    }
    httpGetOne(Order, res, next, orderId, "order")
})

// edit an order e.g cancellation
router.put('/:orderId', isAuthenticated, async (req, res, next) => {
    const { orderId } = req.params;
    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) {
        res.status(404).json({error: `Order with ID ${orderId} not found` })
    }

    if (currentOrder.status === "Shipped" || "Delivered") {
        return res.status(400).json({ error: "Order already shipped" });
    }
    else if (currentOrder.status === "Cancelled") {
        return res.status(400).json({ error: "Order was already cancelled" });
    }

    try {
        const cancelledOrder = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {status: "Cancelled",},
        },
        { 
          new: true,
          runValidators: true,
         }
      );

      res.status(200).json(cancelledOrder);
    }
    catch (error) {
        next(error);
    }
    //httpPut(Order, req, res, next, orderId, "order");
})

// only admin
router.delete('/:orderId', isAuthenticated, isAdmin, (req, res, next) => {
    const { orderId } = req.params;
    httpDelete(Order, res, next, orderId, "order")
})

module.exports = router;