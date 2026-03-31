import db from "./connection";
import { users, tasks, tags, taskTags } from "./schema";

async function seed() {
  console.log("Starting database seed...");
  try {
    //clear existing data
    console.log("clearing existing tables");
    await db.db.delete(taskTags);
    await db.db.delete(tags);
    await db.db.delete(tasks);
    await db.db.delete(users);
    //create demo users
    console.log("creating demo users");
    const [demoUser] = await db.db
      .insert(users)
      .values({ name: "Reduzer", age: 2 })
      .returning();

    console.log(demoUser);

    console.log("creating demo tasks");
    const [jog, pray, code] = await db.db
      .insert(tasks)
      .values([
        {
          summary: "Jogging",
          details: "Jogging in the morning for atleast 30 mins",
          userId: demoUser.id,
        },
        {
          summary: "Praying",
          details: "Attending Friday Kesha at St. Paul's",
          userId: demoUser.id,
        },
        {
          summary: "Coding",
          details: "Completing the remaining tasks",
          userId: demoUser.id,
        },
      ])
      .returning();

    console.log("creating demo tags");
    const [uiux, be, fe, devops] = await db.db
      .insert(tags)
      .values([
        {
          name: "UI/UX",
          color: "red",
        },
        {
          name: "BE",
          color: "Blue",
        },
        {
          name: "FE",
          color: "Green",
        },
        {
          name: "DevOps",
          color: "Amber",
        },
      ])
      .returning();

    console.log("creating demo task tags");
    await db.db.insert(taskTags).values([
      {
        taskId: jog.id,
        tagId: uiux.id,
      },
      {
        taskId: code.id,
        tagId: devops.id,
      },
      {
        taskId: pray.id,
        tagId: be.id,
      },
    ]);
  } catch (e) {
    console.log("Error seeding database");
    console.log(e);
  }
}
seed();
