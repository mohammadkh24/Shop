const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

// Connect DB
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(
        `Database Connected Successfully : ${mongoose.connection.host}`
      );
    } catch (error) {
      console.error("Error in DB Connection Error =>", error);
      process.exit(1);
    }
  };

const startServer = () => {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server Listen On Port ${port}...`);
  });
};

async function run() {
   await connectDB()
  startServer();
}

run();
