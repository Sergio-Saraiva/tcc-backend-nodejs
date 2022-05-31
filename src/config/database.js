require("dotenv").config();

module.exports = {
  dialect: "postgres",
  host: process.env.HOST,
  port: process.env.DB_PORT,
  username: process.env.USERNAMEDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false, // This line will fix new error
    },
  },
};
