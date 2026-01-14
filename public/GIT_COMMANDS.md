# Git Commands Guide

This guide provides step-by-step commands to synchronize your code between this cloud environment and your local machine using a GitHub repository.

---

## 🚀 Daily Workflow: Pull & Push

Use these commands for your daily work.

### On Your Local Machine (or Cloud Environment):

1.  **Pull the latest changes from GitHub.**
    *   This command fetches the latest code and reapplies your local commits on top, preventing most merge conflicts.
    ```bash
    git pull --rebase
    ```

2.  **Add your new changes and commit them.**
    ```bash
    # Stage all changes for commit
    git add .

    # Commit your changes with a clear message
    git commit -m "Your descriptive message here"
    ```

3.  **Push your new commits to GitHub.**
    ```bash
    git push origin main
    ```

---

## 🛠️ One-Time Initial Setup

Only do these steps the very first time you set up your repository.

### In this Cloud Environment:

1.  **Initialize Git & Connect to GitHub:**
    *   Replace `<YOUR_USERNAME>` and `<YOUR_REPOSITORY>` with your actual GitHub info.
    ```bash
    git init
    git branch -m main
    git add .
    git commit -m "Initial commit from cloud environment"
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
    git push -u origin main
    ```

### On Your Local Machine:

1.  **Clone the Repository from GitHub:**
    *   This downloads the project from GitHub to your computer.
    ```bash
    # Replace <YOUR_USERNAME> and <YOUR_REPOSITORY> with your actual GitHub info
    git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

    # Navigate into your new project folder
    cd <YOUR_REPOSITORY>
    ```

---

## 🐛 Troubleshooting

### Error: "fatal: Need to specify how to reconcile divergent branches."

This error happens when both your local machine (or cloud environment) and your remote GitHub repository have new, separate commits.

**Quick Fix:**
Run the `pull` command with the `--rebase` flag. This will fetch the remote changes and place your local commits on top of them.

```bash
git pull --rebase
```

After the pull is successful, you can proceed to `git push` your changes.
