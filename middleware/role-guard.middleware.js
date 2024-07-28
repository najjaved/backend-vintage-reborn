const isAdmin = (req, res, next) => {
    if (req.tokenPayload.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };

module.exports = { isAdmin }