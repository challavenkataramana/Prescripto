import jwt from "jsonwebtoken";

//admin authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.json({ sucess: false, message: "Not authorized login again" });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ sucess: false, message: "Not authorized login again" });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

export default authAdmin;
