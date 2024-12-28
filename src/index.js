import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDb } from "./db/index.js";
import { port } from "./constants.js";

dotenv.config();

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("Server started on port: ", port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to db: ", error);
    process.exit(1);
  });
