const { httpGetOne, httpGetAll, httpPost, httpPut, httpDelete } = require('../helpers/httpMethods')
const User = require('../models/User.model')
const router = require('express').Router()
const { isAuthenticated } = require("../middleware/route-guard.middleware")
const { isAdmin } = require("../middleware/role-guard.middleware")


// Get all users: admin only
router.get('/', isAuthenticated, isAdmin, async (req, res, next) => {
  httpGetAll(User, res, next, "user");
});

// Get user details
router.get('/current', isAuthenticated, async (req, res, next) => {
    const { userId } = req.tokenPayload;
    httpGetOne(User, res, next, userId, "user");

});

// get admin user details: this must be after 'users/current' path
router.get('/:userId',isAuthenticated, isAdmin, (req, res, next) => {
  const { userId } = req.params;
  // regular user can not access admin
  if (userId !== req.tokenPayload.userId) {
    res.status(403).json({ message: "Access forbidden" });
    return next(new Error("User not authorized"));
  }
  httpGetOne(User, res, next, userId, "user");

});


// Edit user profile
router.put('/', isAuthenticated, async (req, res, next) => {
    const { userId } = req.tokenPayload; //toDo: get role also here
    const userToEdit = await User.findById(userId);
   
    // only a user himself or platform admin can edit user's details //toDo: check if userId check is necessary(in this case ), since a user can only see own profile
    if (req.tokenPayload.role !== "admin" || userToEdit._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only edit your profile' });
    }

    httpPut(User, req, res, next, userId, "user");

})

// Edit admin toDo: refactor, make one function for eiditing customer and admin users
router.put('/', isAuthenticated, isAdmin, async (req, res, next) => {
  const { userId } = req.tokenPayload; 
   
  if (req.tokenPayload.role !== "admin") {
    return res.status(403).json({ message: 'Forbidden: You can only edit your profile' });
  }

  httpPut(User, req, res, next, userId, "user");

})

// Delete a user (admin and customer by ID) 
router.delete('/userId', isAuthenticated, async (req, res, next) => {
  const { userId, role } = req.tokenPayload;

  const userToDelete = await User.findById(userId)
  if (!userToDelete) {
    return next(new Error(`User with ID ${userId} not found`));
  }
  // toDo: check if userId check is necessary, since a user can access only own profile, to be able to delete
  if ((role === "admin" && userToDelete._id === userId) ||(userToDelete._id === userId)) {
    httpDelete(User, res, next, userId, "user");
  }
  else {
    return res.status(403).json({ message: 'Forbidden to delete this user' });
  }
   
});

// Delete admin (admin only). Later add super admin who only can delete admins and add admins
router.delete('/userId', isAuthenticated, isAdmin, async (req, res, next) => {
  const { userId } = req.tokenPayload;

  const userToDelete = await User.findById(userId)
  if (!userToDelete) {
    return next(new Error(`User with ID ${userId} not found`));
  }
  if ((userToDelete._id === userId)) {
    httpDelete(User, res, next, userId, "user");
  }
  else {
    return res.status(403).json({ message: 'Forbidden to delete this admin' });
  }
});

module.exports = router;