// Middleware tarafından req.user'a eklenen veriyi döndürür
const getMe = (req, res) => {
  // req.user, koruma middleware'i sayesinde kullanıcı verilerini içerir
  res.status(200).json({
    status: "success",
    code: 200,
    user: req.user,
  });
};

export { getMe };
