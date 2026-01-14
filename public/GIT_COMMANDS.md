# Git Commands Guide

This guide provides the step-by-step commands to initialize a local Git repository, connect it to a remote on GitHub, and synchronize your code.

---

### Step 1: Set up your Local Repository

First, create a new directory on your local machine and initialize a Git repository.

```bash
# Create a new folder for your project and navigate into it
mkdir my-ai-assistant
cd my-ai-assistant

# Initialize a new Git repository
git init

# Create an initial file (like a README) and make your first commit
echo "# AI Code Assistant Project" >> README.md
git add README.md
git commit -m "Initial commit"

# Rename the default branch to 'main' (a common practice)
git branch -M main
```

---

### Step 2: Connect to a GitHub Repository

Next, create a new repository on [GitHub.com](https://github.com/new) and then link your local repository to it.

```bash
# Add the remote repository from GitHub (replace the URL with your own)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Push your initial commit to the 'main' branch on GitHub
git push -u origin main
```

---

### Step 3: Pull Changes from Studio to Your Local Machine

When you've made changes in Firebase Studio and want to get them on your local machine, follow these steps.

**First, in Firebase Studio:** Use the terminal to push your changes to GitHub.

```bash
# Check the status of your changes
git status

# Add all changed files to the staging area
git add .

# Commit the changes with a descriptive message
git commit -m "feat: Add new feature from Studio"

# Push the changes to your 'main' branch on GitHub
git push origin main
```

**Second, on your Local Machine:** Pull the new changes down from GitHub.

```bash
# Navigate to your project directory if you're not already there
cd /path/to/my-ai-assistant

# Pull the latest changes from the 'main' branch
git pull origin main
```

---

### Troubleshooting: "Divergent Branches" Error

If you see an error like `fatal: Need to specify how to reconcile divergent branches` when you run `git pull`, it means you have made commits on your local machine that are not yet on GitHub, and there are also new commits on GitHub from the Studio environment.

**Solution:** The best way to resolve this is to pull with the `--rebase` flag. This will take your local commits, temporarily set them aside, pull down the remote changes, and then re-apply your local commits on top.

```bash
# On your local machine, run this command instead of a normal pull:
git pull --rebase origin main

# After the rebase is successful, your local and remote histories will be in sync.
# You can then push any new local commits if you need to.
git push origin main
```
