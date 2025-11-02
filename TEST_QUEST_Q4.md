# Testing Quest Q4: Branching & Resolve Merge Conflicts

## Quick Start Guide

### Method 1: Direct Database Setup (Recommended)

1. **Run the setup script**:
   ```bash
   node setup-q4-user.js testuser-q4
   ```

2. **Upload quest configs** (if not done):
   ```bash
   node ./src/config/uploadQuestConfig.js
   node ./src/config/uploadHintConfig.js
   ```

3. **Create a repository for the test user** in your GitHub organization:
   ```bash
   # In your admin repo, create an issue and comment:
   /create_repos testuser-q4
   ```

4. **Accept the bot's invitation** to the testuser-q4 repository

5. **Create a new issue** in the testuser-q4 repository

6. **The bot will automatically start Quest Q4** since Q1-Q3 are marked as completed

### Method 2: Manual Database Modification

If you want to manually set up via MongoDB:

1. **Connect to MongoDB**:
   ```bash
   mongosh "YOUR_MONGO_URI" --quiet
   ```

2. **Navigate to your database**:
   ```javascript
   use YOUR_DB_NAME
   ```

3. **Find the user document**:
   ```javascript
   db.user_data.findOne({ _id: "testuser" })
   ```

4. **Manually update the user data**:
   ```javascript
   db.user_data.updateOne(
     { _id: "testuser" },
     {
       $set: {
         "user_data.completed": {
           "Q1": { "T1": { completed: true, attempts: 1, hints: 0 }, /* etc */ },
           "Q2": { /* tasks */ },
           "Q3": { /* tasks */ }
         },
         "user_data.points": 140,
         "user_data.xp": 140
       }
     }
   )
   ```

### Method 3: Temporary Code Modification

For immediate testing, you can temporarily modify `acceptQuest`:

1. **Open**: `src/gamification.js`

2. **Find** the `acceptQuest` function (around line 23)

3. **Temporarily modify** to skip checks:
   ```javascript
   async function acceptQuest(context, user_data, quest) {
     // TEMPORARY: Allow accepting Q4 directly for testing
     if (quest === "Q4" && user_data && !user_data.accepted) {
       // Accept Q4 directly
       user_data.accepted = {};
       user_data.accepted[quest] = {};
       // ... rest of quest setup
     }
     // ... original code
   }
   ```

**⚠️ Remember to revert this change after testing!**

## Testing Each Task

### Task T1: Create Feature Branch

**Expected behavior**:
- User creates branch: `feature/add-[username]-functionality`
- Types "DONE"
- Bot verifies branch exists via GitHub API
- Awards 30 points

**Test command**:
```bash
git checkout -b feature/add-testuser-q4-functionality
```

### Task T2: Make Commit with Proper Message

**Expected behavior**:
- User makes commit following conventional commits format
- Example: `feat: add new feature` or `fix: resolve bug`
- Types "DONE"
- Bot verifies commit message format
- Awards 20 points

**Test command**:
```bash
echo "# Test" > test.md
git add test.md
git commit -m "feat: add test documentation"
```

### Task T3: Create PR with Proper Naming

**Expected behavior**:
- User creates PR with title like: `feat: add authentication`
- Submits PR number
- Bot verifies PR title format
- Awards 25 points

### Task T4: Resolve Merge Conflict

**Expected behavior**:
- User encounters merge conflict
- Resolves conflict markers
- Makes merge commit
- Types "DONE"
- Bot detects merge commit
- Awards 50 points

### Task T5: Complete Code Review & Merge

**Expected behavior**:
- User requests review
- Completes merge
- Types "DONE"
- Bot verifies PR is merged
- Awards 30 points

### Task T6: Quiz

**Expected behavior**:
- 6 questions about Git branching
- User submits answers: `[b,c,c,b,b,c]`
- Bot validates answers
- Provides feedback

## Verification Checklist

- [ ] Branch name verification works
- [ ] Commit message validation works
- [ ] PR title validation works
- [ ] Merge conflict detection works
- [ ] PR merge verification works
- [ ] Quiz grading works
- [ ] Hints are accessible
- [ ] Badges are awarded
- [ ] Bonus points for no hints
- [ ] Progress tracking updates

## Troubleshooting

### Issue: "Quest failed to accept"
- **Cause**: User already has an accepted quest
- **Fix**: Use `/reset_repo` or manually clear `user_data.accepted`

### Issue: "Branch not found"
- **Cause**: Branch name doesn't match expected pattern
- **Fix**: Ensure branch is exactly `feature/add-[username]-functionality`

### Issue: "Invalid commit message"
- **Cause**: Commit doesn't follow conventional format
- **Fix**: Use format like `feat: description` or `fix: description`

### Issue: "Verification failed"
- **Cause**: GitHub API access issues
- **Fix**: Check OSS_REPO in .env and bot permissions

## Quick Reset

To reset a user for retesting:

```bash
# Delete user
node -e "
const { MongoDB } = require('./src/database.js');
const db = new MongoDB();
await db.connect();
await db.wipeUser('testuser-q4');
await db.closeConnection();
"

# Recreate
node setup-q4-user.js testuser-q4
```

## Test Commands Summary

```bash
# Full setup
node setup-q4-user.js testuser-q4
node ./src/config/uploadQuestConfig.js
node ./src/config/uploadHintConfig.js

# Create repo (in GitHub org)
/create_repos testuser-q4

# Reset for retesting
node setup-q4-user.js testuser-q4

# Check user status
node -e "
const { MongoDB } = require('./src/database.js');
const db = new MongoDB();
await db.connect();
console.log(await db.downloadUserData('testuser-q4'));
await db.closeConnection();
"
```

## Expected Results

After completing Q4, user should have:
- **Points**: 155 base + bonuses (up to 305 total)
- **XP**: 155
- **Badge**: 🌿 Git Branch Master
- **All Sub-badges**: Branch Master, Commit Champion, PR Pro, Conflict Resolver, Advanced Git Wizard
- **Completed Quests**: Q1, Q2, Q3, Q4

## Contact

If you encounter issues, check:
1. MongoDB connection
2. GitHub bot permissions
3. OSS_REPO configuration
4. Quest/hint upload status
5. Console logs for errors

