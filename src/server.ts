import express from "express";
import TaskRouter from "./routes/task.routes";
import UserRouter from "./routes/user.routes"

const app = express();

app.use(express.json());

app.use("/tasks", TaskRouter);
app.use("/users", UserRouter);

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost: ${PORT}`);
});
