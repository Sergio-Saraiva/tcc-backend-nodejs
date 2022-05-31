const app = require("./app");

app.listen(process.env.PORT || 3334, () => {
  console.log(`server running on port ${process.env.APP_PORT || 3334}`);
});
