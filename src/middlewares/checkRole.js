export const checkRole = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: `Access forbidden: ${requiredRole} role required` });
    }
    next();
  };
  