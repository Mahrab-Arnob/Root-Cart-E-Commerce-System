export const isAuth = (req, res, next) => {
  req.user = { _id: "test", name: "Test", email: "test@example.com", role: "admin" };
  next();
};
