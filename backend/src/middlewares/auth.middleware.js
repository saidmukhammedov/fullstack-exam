import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ statusCode: 401, message: "Tizimga kiring" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Token muddati tugagan" });
    }
    res.status(401).json({ statusCode: 401, message: "Tizimga kiring" });
  }
};
