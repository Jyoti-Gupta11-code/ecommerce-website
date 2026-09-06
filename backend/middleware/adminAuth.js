import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized."
      });
    }

    next();

  } catch (error) {
    console.log("AdminAuth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token Invalid or Expired"
    });
  }
};

export default adminAuth;