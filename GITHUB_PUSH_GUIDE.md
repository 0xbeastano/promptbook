# GitHub Push Guide

Follow these exact steps to push PromptBook to a new GitHub repository from your local machine.

## Option 1: Using Standard Git Commands (Recommended)

Run these commands inside your project folder (`promptbook-extension`):

```bash
# 1. Initialize Git (if not already initialized)
git init

# 2. Check your branch name and rename to 'main'
git branch -M main

# 3. Add all files to staging (respects .gitignore)
git add .

# 4. Commit your files
git commit -m "Initial commit: PromptBook local-first release"

# 5. Add your new GitHub repository as the remote
# Replace YOUR_USERNAME and YOUR_REPO_NAME below
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push to GitHub
git push -u origin main
```

---

## Option 2: Using GitHub CLI (`gh`)

If you have the [GitHub CLI](https://cli.github.com/) installed and authenticated, you can create and push the repo entirely from the terminal:

```bash
# 1. Initialize and commit
git init
git branch -M main
git add .
git commit -m "Initial commit: PromptBook local-first release"

# 2. Create the repo and push in one command
# This creates a public repo. Change --public to --private if desired.
gh repo create promptbook --public --source=. --remote=origin --push
```

---

## Troubleshooting & Common Commands

**How to check what remote is currently set:**
```bash
git remote -v
```

**How to remove an old remote (if you get a "remote origin already exists" error):**
```bash
git remote remove origin
```

**How to push updates after the first push:**
After making new changes, simply run:
```bash
git add .
git commit -m "Describe your changes here"
git push
```
