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

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // İstek atan kullanıcının IP adresini al
    const ipAddress = req.ip || req.connection.remoteAddress;

    // ✨ Login servisini yeni parametrelerle çağır
    const result = await authService.loginUser(email, password, ipAddress);

    res.status(200).json({
      status: "success",
      code: 200,
      accessToken: result.accessToken, // Access Token döndür
      refreshToken: result.refreshToken, // Refresh Token döndür
      user: result.user,
    });
  } catch (error) {
    if (error.message.includes("Invalid")) {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

const logout = async (req, res, next) => {
  // ✨ Yeni Logout fonksiyonu (#3)
  try {
    // Refresh tokenı body'den alınması beklenir
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "Refresh token is required for logout." });
    }

    await authService.logoutUser(refreshToken);

    // Başarılı oturum sonlandırma
    res.status(204).end();
  } catch (error) {
    if (error.message.includes("Invalid")) {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

const refreshTokensController = async (req, res, next) => {
  // ✨ Yeni Refresh Token fonksiyonu (#12)
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    const result = await authService.refreshTokens(oldRefreshToken);

    res.status(200).json({
      status: "success",
      code: 200,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message.includes("Invalid") || error.message.includes("failed")) {
      // Token geçersiz veya süresi dolmuşsa 403 Forbidden/Unauthorized
      return res
        .status(403)
        .json({ message: "Forbidden. Invalid or expired refresh token." });
    }
    next(error);
  }
};

export {
  register,
  login,
  logout, // ✨ Export edildi
  refreshTokensController, // ✨ Export edildi
};
