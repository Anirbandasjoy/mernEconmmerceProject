const app = require("./app");
const databaseConnection = require("./config/db");
const { PORT } = require("./secret");
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await databaseConnection();
});
