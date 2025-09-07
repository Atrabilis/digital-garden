# Git Common Tasks

## 🔄 Refresh .gitignore

When you've updated `.gitignore` and need to remove already tracked files:

```bash
# Remove all files from index (without deleting from disk)
git rm -r --cached .

# Re-add everything, now respecting the updated .gitignore
git add .

# Commit the changes
git commit -m "Refresh .gitignore - remove tracked files"
```
