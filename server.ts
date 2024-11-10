import { initDB } from "./src/config/db";

const app = require('./src/config/app');
require('dotenv').config();

const startServer = async () => {
  try {

    if(!process.env.server_env) {
      process.env.server_env = "dev";
    }

    console.log("server environment............" + process.env.server_env);
    initDB()
    app.listen(process.env.PORT, () => {
      console.log('Server is listening',process.env.server_env);
    })
  } catch(error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

startServer();