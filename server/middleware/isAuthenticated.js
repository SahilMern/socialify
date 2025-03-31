import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies;
    console.log(token, "token");
    if (!token) {
      return res.status(401).json({
        message: "User Not Authenticated",
        sucess: falses,
      });
    }

    const decode = await jwt.verify(token, "sahilyadavsahilyadavsahilyadav");
    console.log(decode, "decode");
    if (!decode) {
      return res.status(401).json({
        message: "User Not Authenticated",
        sucess: falses,
      });
    }

    req.id = decode.userId
    // req.user = 
    next()
  } catch (error) {
    console.log(error);
  }
};
