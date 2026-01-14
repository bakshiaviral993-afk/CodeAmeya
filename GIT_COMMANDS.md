# Git Commands for Syncing Changes

This guide provides the step-by-step commands to push your code from this development environment to a GitHub repository and then pull those changes to your local machine.

---

### Part 1: Pushing Changes from This Environment to GitHub

Follow these steps in the terminal of this environment.

**Step 1: Initialize Git (if you haven't already)**
If this is your first time using Git in this project, you need to initialize a repository.

```bash
git init
```

**Step 2: Stage All Your Changes**
This command prepares all the modified and new files to be saved in your project's history.

```bash
git add .
```

**Step 3: Commit Your Changes**
This saves a snapshot of your staged files. Use a descriptive message to remember what you changed.

```bash
git commit -m "feat: Implement AI Code Assistant Chrome Extension"
```

**Step 4: Connect to Your GitHub Repository**
You need to tell Git where your remote repository is located. You only need to do this once per project.

**Important:** Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details.

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

If you get an error that `origin` already exists, you can set the URL with:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

**Step 5: Push Your Code to GitHub**
This uploads your committed changes to the `main` branch on GitHub.

```bash
git push -u origin main
```

*(For subsequent pushes, you can simply use `git push`)*

---

### Part 2: Pulling Changes to Your Local Machine

Follow these steps in the terminal on your local computer.

**Scenario A: This is your first time getting the code locally**

**Step 1: Clone the Repository**
This command downloads the entire project from GitHub to a new folder on your computer.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

**Step 2: Navigate into the Project Directory**
```bash
cd YOUR_REPOSITORY_NAME
```
You now have all the latest code!

**Scenario B: You already have the project folder locally**

**Step 1: Navigate into the Project Directory**
Make sure you are inside your project folder.

```bash
cd path/to/YOUR_REPOSITORY_NAME
```

**Step 2: Pull the Latest Changes**
This command fetches the latest updates from GitHub and merges them into your local files.

```bash
git pull origin main
```

You are now up-to-date with all the changes you pushed from the other environment.
