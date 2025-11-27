import swaggerJsdoc from "swagger-jsdoc";

const options = {
  // API'nizin temel bilgileri
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SlimMom Diet App API",
      version: "1.0.0",
      description: "GoIT Final Team Project - Backend API Documentation.",
    },
    servers: [
      {
        url: "/api/v1", // Tüm rotalarımızın prefix'i
      },
    ],
    // JWT Yetkilendirme şemasını tanımlama
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Access Token (Authorization: Bearer <token>)",
        },
      },
      // CalorieInput gibi ortak şemaları buraya ekleyebilirsiniz
    },
    security: [
      {
        // Tüm rotalarda varsayılan olarak BearerAuth kullanılacağını belirtir (Korumalı rotalar için geçerlidir)
        BearerAuth: [],
      },
    ],
  },
  // Rota dosyalarımızın bulunduğu yerler
  apis: [
    "./routes/api/v1/*.js", // Tüm rota dosyalarındaki JSDoc yorumlarını oku
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
