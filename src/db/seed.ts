import "dotenv/config";

import { db } from "./connection.js";
import { users, tasks, tags, taskTags } from "./schema.js";

async function seed() {
  console.log("Starting database seed...");
  try {
    //clear existing data
    console.log("clearing existing tables");
    await db.delete(taskTags);
    await db.delete(tags);
    await db.delete(tasks);
    await db.delete(users);
    //create demo users
    console.log("creating demo users");
    const [user1, user2] = await db
      .insert(users)
      .values([
        {
          name: "User1",
          age: 2,
          email: "user1@gmail.com",
          password: "user123",
        },
        {
          name: "User2",
          age: 35,
          email: "user2@gmail.com",
          password: "user234",
        },
      ])
      .returning();

    console.log("creating demo tasks");
    const [jog, pray, code] = await db
      .insert(tasks)
      .values([
        {
          summary: "Jogging",
          details: "Jogging in the morning for atleast 30 mins",
          userId: user1?.id ?? `${Date.now()}`,
        },
        {
          summary: "Praying",
          details: "Attending Friday Kesha at St. Paul's",
          userId: user2?.id ?? `${Date.now()}`,
        },
        {
          summary: "Coding",
          details: "Completing the remaining tasks",
          userId: user1?.id ?? `${Date.now()}`,
        },
        {
          summary: "End year project",
          details: "Completing for end year project and pitching",
          userId: user2?.id ?? `${Date.now()}`,
        },
      ])
      .returning();

    console.log("creating demo tags");
    const [uiux, be, fe, devops] = await db
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
    await db.insert(taskTags).values([
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
