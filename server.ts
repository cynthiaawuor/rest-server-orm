import express from "express";
import fs from "fs";
import Task from "./types/task";

function readTasksFromJson() {
  const raw = fs.readFileSync("./data/task.json").toString();
  const tasks = JSON.parse(raw) as Task[];
  return tasks;
}
function writeTasksToJson(tasks: Task[]) {
  fs.writeFileSync("./data/task.json", JSON.stringify(tasks));
}

const app = express();

app.use(express.json());

app.get("/tasks", (req, res) => res.type("json").send(readTasksFromJson()));
app.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const tasks = readTasksFromJson();
  const task = tasks.find((task) => task.id.toString() === id);
  if (!task) {
    res.type("text").status(404).send("Task not found");
  } else {
    res.json(task);
  }
});

app.post("/tasks", (req, res) => {
  const task = req.body as Task;
  if (!task.summary) {
    res.type("json").status(422).send("Summary is requred");
    return;
  }
  task.id = Date.now();
  if (task.completed === null || task.completed === undefined) {
    task.completed = false;
  }
  if (!task.details) {
    task.details = null;
  }

  const tasks = readTasksFromJson();

  tasks.push(task);

  writeTasksToJson(tasks);
  res.type("json").status(201).send(task);
});

app.patch("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const tasks = readTasksFromJson();
  const taskIndex = tasks.findIndex((task) => task.id.toString() === id);
  const task = tasks[taskIndex];
  if (!task) {
    res.type("text").status(404).send("Task not found");
  } else {
    const payload = req.body;
    if (payload.summary) {
      task.summary = payload.summary;
    }
    if (task.completed !== payload.completed) {
      task.completed = payload.completed;
    }
    if (payload.details) {
      task.details = payload.details;
    }

    tasks[taskIndex] = task;

    writeTasksToJson(tasks);
    res.type("json").status(202).send(task);
  }
});
// app.put("/tasks/:id");

app.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const tasks = readTasksFromJson();
  const taskIndex = tasks.findIndex((task) => task.id.toString() === id);

  if (taskIndex === -1) {
    res.type("text").status(404).send("Task not found");
  } else {
    tasks.splice(taskIndex, 1);
    writeTasksToJson(tasks);
    res.status(204).end();
  }
});

app.use((req, res) => {
  res
    .status(404)
    .type("application/json")
    .send({ statusCode: 404, message: "Not Found" });
});

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost: ${PORT}`);
});
