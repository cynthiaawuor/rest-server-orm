import "dotenv/config";

import express from "express";
import TaskRouter from "./routes/task.routes.js";
import UserRouter from "./routes/user.routes.js";
import TagRouter from "./routes/tag.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import { loggingMiddleware } from "./middleware/logging.js";

const app = express();
app.use(loggingMiddleware);
app.use(express.json());

app.use("/tasks", TaskRouter);
app.use("/users", UserRouter);
app.use("/tags", TagRouter);
app.use("/auth/api", AuthRouter);

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
