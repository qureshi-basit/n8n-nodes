#!/bin/bash

# agent-push.sh
#
# Called by the Node Hunter agent after scaffolding a new node.
# 
# Usage:
#   ./scripts/agent-push.sh <node-folder-name>
#
# Example:
#   ./scripts/agent-push.sh n8n-nodes-firecrawl
#
# What it does:
#   1. Validates the node folder has required files
#   2. Builds the manifest locally
#   3. Updates the README table
#   4. Commits and pushes to main
#   5. The GitHub Action then syncs to Supabase automatically

set -e

NODE_FOLDER=$1
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_PATH="$REPO_ROOT/nodes/$NODE_FOLDER"

if [ -z "$NODE_FOLDER" ]; then
  echo "❌ Usage: ./scripts/agent-push.sh <node-folder-name>"
  exit 1
fi

if [ ! -d "$NODE_PATH" ]; then
  echo "❌ Node folder not found: $NODE_PATH"
  exit 1
fi

echo "🔍 Validating node structure..."

# Check required files
REQUIRED_FILES=("node-meta.json" "package.json" "README.md")
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$NODE_PATH/$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done

# Check node-meta.json has required fields
NODE_NAME=$(node -e "const m=require('$NODE_PATH/node-meta.json'); console.log(m.name || '')")
PACKAGE_NAME=$(node -e "const m=require('$NODE_PATH/node-meta.json'); console.log(m.package_name || '')")

if [ -z "$NODE_NAME" ] || [ -z "$PACKAGE_NAME" ]; then
  echo "❌ node-meta.json missing 'name' or 'package_name' fields"
  exit 1
fi

echo "✓ Validated: $NODE_NAME ($PACKAGE_NAME)"

# Check for nodes/ or credentials/ directory
if [ ! -d "$NODE_PATH/nodes" ] && [ ! -d "$NODE_PATH/credentials" ]; then
  echo "⚠️  Warning: No nodes/ or credentials/ directory found"
fi

echo ""
echo "📦 Building manifest..."
node "$REPO_ROOT/scripts/build-manifest.js"

echo ""
echo "📝 Updating README..."
node "$REPO_ROOT/scripts/update-readme.js"

echo ""
echo "🚀 Pushing to GitHub..."
cd "$REPO_ROOT"
git add -A
git commit -m "feat: add $NODE_NAME node ($PACKAGE_NAME)

- Added by Node Hunter agent
- Category: $(node -e "const m=require('$NODE_PATH/node-meta.json'); console.log(m.category || 'Other')")
- Status: $(node -e "const m=require('$NODE_PATH/node-meta.json'); console.log(m.status || 'stable')")
"

git push origin main

echo ""
echo "✅ Done! $NODE_NAME has been pushed."
echo "   → GitHub Action will now sync to Supabase"
echo "   → Node will appear on basitq.cloud/nodes within ~60 seconds"
