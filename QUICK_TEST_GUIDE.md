# 🚀 Quick Test Guide for Quest Q4

## Fastest Way to Test Quest Q4

### Step 1: Setup Test User
```bash
node setup-q4-user.js testuser
```

This creates a user with Q1-Q3 completed.

### Step 2: Upload Quest Configs (First Time Only)
```bash
node ./src/config/uploadQuestConfig.js
node ./src/config/uploadHintConfig.js
```

### Step 3: Create Repository
In your GitHub organization admin repo, create an issue and comment:
```
/create_repos testuser
```

### Step 4: Start Quest Q4
In your GitHub organization admin repo, create an issue and comment:
```
/start_quest testuser
```

This will create a Quest Q4 issue in the `testuser` repository and update their README.

### Step 5: Test Quest Q4
1. Go to the `testuser` repository
2. You should see a new issue: "❗ Q4 T1: Create and switch to a feature branch"
3. Click on the issue to start completing tasks! 🎉

---

## What Quest Q4 Tests

✅ **Branch Creation**: `feature/add-[username]-functionality`  
✅ **Commit Messages**: Conventional commits (`feat:`, `fix:`, etc.)  
✅ **PR Naming**: Follows conventional format  
✅ **Merge Conflicts**: Detects and resolves conflicts  
✅ **Code Review**: Completes merge workflow  

## Reset for Retesting

```bash
# Run this to reset and retest
node setup-q4-user.js testuser
```

## Need Help?

See `TEST_QUEST_Q4.md` for detailed troubleshooting.

