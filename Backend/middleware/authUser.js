import jwt from "jsonwebtoken";

//User authentication middleware

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ sucess: false, message: "Not authorized login again" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = token_decode.id;
    next();
    
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

export default authUser;
