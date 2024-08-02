const router = require('express').Router()

//All routes starts with /api

router.get('/', (req, res) => {
  res.json('All good in /api')
})

const usersRoutes = require("./users.routes")
router.use("/users", usersRoutes)

const ordersRoutes = require("./orders.routes")
router.use("/orders", ordersRoutes)

const productRoutes = require("./products.routes")
router.use("/products", productRoutes)

const cartRoutes = require("./carts.routes")
router.use("/carts", cartRoutes)

module.exports = router
