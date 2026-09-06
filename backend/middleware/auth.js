import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again"
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId
    req.body.userId = decoded.id;

    next();

  } catch (error) {
    console.log(error);

    // 🔴 Token expired case
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "jwt expired"
      });
    }

    // ❌ Invalid token
    return res.status(401).json({
      success: false,
      message: "Invalid Token"
    });
  }
};

export default authUser;