require("dotenv").config();

module.exports = {
  dialect: "postgres",
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USERNAMEDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {},
};
