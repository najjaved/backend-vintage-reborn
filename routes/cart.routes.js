const { httpGetOne, httpGetAll, httpPut, httpDelete, httpPost } = require('../helpers/httpMethods');
const { isAuthenticated } = require('../middleware/route-guard.middleware');
const Cart = require('../models/Cart.models')
const router = require("express").Router()


// Fetch cart of an authenticated user
router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json({ cartItems: cart.items });
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post('/', isAuthenticated, async (req, res, next) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [{ productId, quantity }] });
    }
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }
    await cart.save(); //test
    res.status(201).json({ cartItems: cart.items });
  } catch (error) {
    next(error); // OR //res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/product/:productId', isAuthenticated, async (req, res, next) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.status(200).json({ cartItems: cart.items });
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
router.delete('/', isAuthenticated, async (req, res, next) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
  }
    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    res.status(200).json({ cartItems: cart.items });
  } catch (error) {
    next(error);
  }
});


module.exports = router;