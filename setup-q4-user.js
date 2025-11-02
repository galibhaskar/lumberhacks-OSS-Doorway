/**
 * Quick Setup Script for Quest Q4 Testing
 * 
 * This script creates a user and marks Q1-Q3 as completed
 * so you can immediately test Quest Q4
 * 
 * Usage: node setup-q4-user.js <username>
 */

import { MongoDB } from "./src/database.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const questFilePath = "./src/config/quest_config.json";

async function setupUser(username) {
  console.log(`\n🚀 Setting up ${username} for Q4 testing...\n`);

  try {
    const db = new MongoDB();
    await db.connect();

    // Delete if exists
    console.log("🧹 Cleaning existing data...");
    await db.wipeUser(username);

    // Create user
    console.log("👤 Creating user...");
    await db.createUser(username);

    // Load user data
    let userDoc = await db.downloadUserData(username);
    let userData = userDoc.user_data;

    // Load quest config
    const quests = JSON.parse(fs.readFileSync(questFilePath, "utf8"));

    // Mark Q1-Q3 as completed
    console.log("✅ Marking Q1, Q2, Q3 as completed...");
    userData.completed = {};

    for (const questKey of ["Q1", "Q2", "Q3"]) {
      userData.completed[questKey] = {};
      for (const taskKey in quests[questKey]) {
        if (taskKey !== "metadata") {
          userData.completed[questKey][taskKey] = {
            completed: true,
            attempts: 1,
            hints: 0,
            timeStart: Date.now() - 1000000,
            timeEnd: Date.now() - 500000,
            issueNum: 1
          };
        }
      }
    }

    // Set points/XP from completed quests
    userData.points = 140;
    userData.xp = 140;

    // Save
    userDoc.user_data = userData;
    await db.updateData(userDoc);
    console.log("💾 Saved to database");

    await db.closeConnection();

    console.log("\n✅ Setup complete!");
    console.log(`📝 User '${username}' has Q1-Q3 completed and is ready for Q4`);
    console.log("\n🎯 Next: Create an issue in the user's repo to trigger Q4");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

const username = process.argv[2];
if (!username) {
  console.log("❌ Usage: node setup-q4-user.js <username>");
  process.exit(1);
}

setupUser(username);

