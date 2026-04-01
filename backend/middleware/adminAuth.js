import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get token from headers
    const { token } = req.headers;

    // 2️⃣ If token not present → stop request
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again."
      });
    }

    // 3️⃣ Verify token using JWT secret
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Check if decoded data matches admin credentials
    if (
      token_decode !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again."
      });
    }

    // 5️⃣ If everything correct → go to next function
    next();

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

export default adminAuth;