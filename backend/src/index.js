import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import router from "./routes/routes.js";

const app = express();
const PORT = 9000;

app.use(cors())
app.use(helmet());
app.use(morgan("dev"))
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});