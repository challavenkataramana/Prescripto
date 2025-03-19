import jwt from "jsonwebtoken";

//admin authentication middleware

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
  
    if (!dtoken) {
      return res.json({ sucess: false, message: "Not authorized login again" });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
   
    req.body.docId = token_decode.id;
    next();
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

export default authDoctor;
