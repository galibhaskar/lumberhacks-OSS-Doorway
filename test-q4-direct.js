/**
 * Test Script: Start User Directly on Quest Q4
 * 
 * This script helps you test Quest Q4 by creating a user with Q1-Q3 marked as completed
 * and immediately starting Q4.
 * 
 * Usage:
 *   node test-q4-direct.js <username>
 */

import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import { MongoDB } from "./src/database.js";
import { gameFunction } from "./src/gamification.js";

dotenv.config();

const questFilePath = "./src/config/quest_config.json";

class QuestContext {
  constructor(username) {
    this.username = username;
    this.owner = "YOUR_ORG_NAME"; // Replace with your org
    this.repo = username;
    this.issueNumber = 1;
    this.payload = {
      installation: {
        id: process.env.INSTALLATION_ID || "123456"
      }
    };
  }

  repo() {
    return { owner: this.owner, repo: this.repo };
  }

  issue() {
    return { issue_number: this.issueNumber };
  }

  octokit = {
    issues: {
      create: async (params) => {
        console.log("📝 Would create issue:", params.title);
        return { data: { number: this.issueNumber++ } };
      },
      createComment: async (params) => {
        console.log("💬 Would post comment:", params.body.substring(0, 100) + "...");
      },
      update: async (params) => {
        console.log("✅ Would update issue:", params.state);
      },
      listForRepo: async () => ({ data: [] })
    },
    repos: {
      getReadme: async () => ({ data: { sha: "abc123" } }),
      createOrUpdateFileContents: async (params) => {
        console.log("📄 Would update:", params.path);
      },
      getContent: async () => ({ data: { sha: "abc123" } })
    },
    auth: async () => ({ token: "test_token" }),
    request: async (url, params) => {
      console.log("🌐 Would call:", url);
      return { data: [] };
    }
  };
}

async function createUserForQ4(username) {
  console.log(`\n🚀 Setting up user '${username}' for Quest Q4 testing...\n`);

  try {
    // Connect to database
    const db = new MongoDB();
    await db.connect();

    // Delete user if exists
    console.log("🧹 Cleaning up existing user data...");
    await db.wipeUser(username);

    // Create new user
    console.log("👤 Creating new user...");
    const created = await db.createUser(username);
    if (!created) {
      console.error("❌ Failed to create user");
      await db.closeConnection();
      return;
    }

    // Load quest config
    const quests = JSON.parse(fs.readFileSync(questFilePath, "utf8"));

    // Download user data
    let user_document = await db.downloadUserData(username);
    let user_data = user_document.user_data;

    // Manually mark Q1, Q2, Q3 as completed
    console.log("📋 Marking Q1, Q2, Q3 as completed...");
    user_data.completed = {};

    // Complete Q1
    user_data.completed.Q1 = {};
    for (const task in quests.Q1) {
      if (task !== "metadata") {
        user_data.completed.Q1[task] = {
          completed: true,
          attempts: 1,
          hints: 0,
          timeStart: Date.now() - 3600000,
          timeEnd: Date.now() - 3000000,
          issueNum: 1
        };
      }
    }

    // Complete Q2
    user_data.completed.Q2 = {};
    for (const task in quests.Q2) {
      if (task !== "metadata") {
        user_data.completed.Q2[task] = {
          completed: true,
          attempts: 1,
          hints: 0,
          timeStart: Date.now() - 2400000,
          timeEnd: Date.now() - 1800000,
          issueNum: 1
        };
      }
    }

    // Complete Q3
    user_data.completed.Q3 = {};
    for (const task in quests.Q3) {
      if (task !== "metadata") {
        user_data.completed.Q3[task] = {
          completed: true,
          attempts: 1,
          hints: 0,
          timeStart: Date.now() - 1200000,
          timeEnd: Date.now() - 600000,
          issueNum: 1
        };
      }
    }

    // Set up points and XP from completed quests
    user_data.points = 140; // Sum of Q1, Q2, Q3 points
    user_data.xp = 140;
    user_data.level = 2;

    // Accept Q4
    console.log("🎯 Starting Quest Q4...");
    const mockContext = new QuestContext(username);
    
    // Use the acceptQuest function directly
    const acceptResult = await gameFunction.acceptQuest(mockContext, user_data, "Q4");
    
    if (acceptResult) {
      console.log("✅ Quest Q4 accepted successfully!");
    } else {
      console.log("⚠️  Could not accept Q4 (this is expected in test mode)");
    }

    // Update user data in database
    user_document.user_data = user_data;
    await db.updateData(user_document);
    console.log("💾 User data saved to database");

    // Disconnect
    await db.closeConnection();

    console.log("\n🎉 Setup complete! User is now ready for Quest Q4");
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Go to your GitHub organization`);
    console.log(`   2. Open the repository for user: ${username}`);
    console.log(`   3. Create a new issue`);
    console.log(`   4. The bot should automatically start Quest Q4`);
    console.log(`\n💡 Note: Since this is a test environment, issue creation is simulated.`);
    console.log(`   In a real environment, the bot will automatically create the first task issue.`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Get username from command line
const username = process.argv[2];

if (!username) {
  console.log("\n❌ Error: Please provide a username");
  console.log("\nUsage: node test-q4-direct.js <username>");
  console.log("\nExample: node test-q4-direct.js testuser");
  process.exit(1);
}

createUserForQ4(username);

