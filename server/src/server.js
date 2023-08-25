const app = require("./app");
const databaseConnection = require("./config/db");
const logger = require("./controllers/logerController");
const { PORT } = require("./secret");
app.listen(PORT, async () => {
  logger.log("info", `Server is running at http://localhost:${PORT}`);
  await databaseConnection();
});
