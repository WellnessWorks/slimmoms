import * as authService from "../services/authService.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Gelen veriyi kontrol et (daha sonra validator kullanılacak)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await authService.registerUser(name, email, password);

    res.status(201).json({
      status: "success",
      code: 201,
      user: {
        name: user.name,
        email: user.email,
        // ...
      },
    });
  } catch (error) {
    // E-posta zaten kullanımda hatası (409 Conflict)
    if (error.message.includes("already in use")) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Gelen veriyi kontrol et
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      status: "success",
      code: 200,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    // Kimlik doğrulama hatası (401 Unauthorized)
    if (error.message.includes("Invalid")) {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

export { register, login };
