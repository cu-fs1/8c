import { StatusCodes } from "http-status-codes";

/**
 * Middleware to check if the authenticated user has the required role(s).
 * @param {...string} allowedRoles - The roles that are allowed to access the route.
 * @returns {Function} Middleware function.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized: User not found in request" });
    }

    const hasRequiredRole = req.user.roles.some((role) =>
      allowedRoles.includes(role),
    );
    if (!hasRequiredRole) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: `Forbidden: You do not have permission to perform this action. Required one of: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

export default authorize;
