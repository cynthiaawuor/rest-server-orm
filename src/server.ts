import express from "express";
import route from "./routes/task.routes";

const app = express();

app.use(express.json());

app.use("/tasks", route);

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost: ${PORT}`);
});
