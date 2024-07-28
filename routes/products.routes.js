const mongoose = require('mongoose');
const { httpGetOne, httpGetAll, httpPut, httpDelete, httpPost } = require('../helpers/httpMethods');
const { isAuthenticated } = require('../middleware/route-guard.middleware');
const Product = require('../models/Product.model')
const router = require("express").Router()

router.get('/', async(req, res, next) => {
    try {
        const productsData = await Product.find().populate('createdBy', 'username email'); // populate only username and email
        res.json(productsData);
    } 
    catch (error) {
        next(error);
    }
  
    // httpGetAll(Product, res, next, "products") //todDo: refactoring later
})

// get details of a product with provided id
router.get('/:productId', async(req, res, next) => {
    const { productId } = req.params;
    httpGetOne(Product, res, next, productId, "products") 
})

// get products by category
router.get('/category/:category', async (req, res, next) => {
  const { category } = req.params;
  try {
      const productsByCategory = await Product.find({ category });

      if (!productsByCategory) {
          return next(new Error(`Products with category ${category} not found`));
      }

      res.status(200).json(productsByCategory);
  }
  catch (error) {
      next(error);
  }
})

router.post('/', isAuthenticated, async (req, res, next) => {
    req.body.createdBy = req.tokenPayload.userId;
    httpPost(Product, req, res, next); //todDo: refactor the rest likewise
})

router.put('/:productId', isAuthenticated, async (req, res, next) => {
    const { productId } = req.params;
    const productToEdit = await Product.findById(productId);
    if (!productToEdit) {
      return next(new Error(`Product with ID ${productId} not found`))
    }
   
    // only authorized user or platform admin can edit a product's details
    if (productToEdit.createdBy.toString() !== req.tokenPayload.userId.toString() || req.tokenPayload.role !== "admin") {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own products' });
    } 
    httpPut(Product, req, res, next, productId, "products") //toDO: later
})



router.delete('/:productId', isAuthenticated, async(req, res, next) => {
    const { productId } = req.params;
    const productToDelete = await Product.findById(productId);
    if (!productToDelete) {
      return next(new Error(`Product with ID ${productId} not found`))
    }
   
    // only authorized user or platform admin can delete a product
    if (productToDelete.createdBy.toString() !== req.tokenPayload.userId.toString() || req.tokenPayload.role !== "admin") {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own products' });
    } 
        
    //to Do: refactor: httpDelete
    try {
      const deletedproduct = await Product.findByIdAndDelete(productId)
      console.log ("Following product deleted: ", deletedproduct)

      res.status(204).send()
  
    } catch (error) {
    next(error)
    }
})


module.exports = router;