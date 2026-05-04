#!/bin/bash
set -e

SOURCE_DIR="$HOME/Portfolio/Nodes/Agent/n8n-node-hunter/generated_nodes"
TARGET_DIR="$HOME/Downloads/n8n-nodes-basitq/nodes"

mkdir -p "$TARGET_DIR"

echo "Migrating nodes from $SOURCE_DIR..."
echo ""

for NODE_DIR in "$SOURCE_DIR"/n8n-nodes-*/; do
  FOLDER_NAME=$(basename "$NODE_DIR")
  echo "Processing $FOLDER_NAME..."

  # Copy everything except node_modules and dist
  mkdir -p "$TARGET_DIR/$FOLDER_NAME"
  rsync -a --exclude='node_modules' --exclude='dist' --exclude='.git' "$NODE_DIR" "$TARGET_DIR/$FOLDER_NAME/"

  # Read package.json
  PKG="$TARGET_DIR/$FOLDER_NAME/package.json"
  if [ ! -f "$PKG" ]; then
    echo "  ⚠ No package.json, skipping"
    continue
  fi

  PKG_NAME=$(node -e "console.log(require('$PKG').name || '')")
  PKG_DESC=$(node -e "console.log(require('$PKG').description || '')")
  PKG_VERSION=$(node -e "console.log(require('$PKG').version || '0.1.0')")

  # Extract display name from folder (n8n-nodes-clay → Clay)
  SERVICE_NAME=$(echo "$FOLDER_NAME" | sed 's/n8n-nodes-//' | sed 's/-v[0-9]*$//' | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | sed 's/ //g')
  DISPLAY_NAME=$(echo "$FOLDER_NAME" | sed 's/n8n-nodes-//' | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')

  # Try to extract operations from .node.ts
  TS_FILE=$(find "$TARGET_DIR/$FOLDER_NAME/nodes" -name "*.node.ts" 2>/dev/null | head -1)
  OPERATIONS="[]"
  CRED_TYPE="null"
  if [ -n "$TS_FILE" ]; then
    OPERATIONS=$(node -e "
      const fs = require('fs');
      const src = fs.readFileSync('$TS_FILE', 'utf8');
      const ops = [];
      const re = /name:\s*'([^']+)',\s*value:\s*'([^']+)',\s*description:\s*'([^']*)'/g;
      let m;
      while ((m = re.exec(src)) !== null) ops.push(m[1]);
      const unique = [...new Set(ops)].filter(o => !['Table','Row','Enrichment','Resource','Operation','Person','Company','Contact','Lead','Deal','Account','Event','Message','Channel','User','File','Record','Item','Project','Task','List','Board','Card','Sheet','Page','Database','Collection','Document','Webhook','Email','Chat','Group','Member','Invoice','Payment','Order','Product','Customer','Subscription'].includes(o));
      console.log(JSON.stringify(unique.length > 0 ? unique : ops.slice(0, 10)));
    " 2>/dev/null || echo "[]")

    CRED_TYPE=$(node -e "
      const fs = require('fs');
      const src = fs.readFileSync('$TS_FILE', 'utf8');
      const m = src.match(/name:\s*'(\w+)',\s*required:\s*true/);
      console.log(m ? '\"' + m[1] + '\"' : 'null');
    " 2>/dev/null || echo "null")
  fi

  # Auto-detect category
  CATEGORY="Other"
  case "$FOLDER_NAME" in
    *claude*|*gpt*|*ai*|*alchemyst*|*zep*|*optimly*) CATEGORY="AI & LLM" ;;
    *google-ads*) CATEGORY="CRM & Sales" ;;
    *google-chat*|*nano-banana*) CATEGORY="Communication" ;;
    *razorpay*) CATEGORY="Finance" ;;
    *clickhouse*) CATEGORY="DevOps" ;;
    *power-bi*) CATEGORY="Productivity" ;;
    *clay*) CATEGORY="Data & Scraping" ;;
    *upload*) CATEGORY="Productivity" ;;
  esac

  # Auto-detect emoji
  EMOJI="🔧"
  case "$FOLDER_NAME" in
    *claude*|*gpt*|*ai*|*alchemyst*) EMOJI="🤖" ;;
    *google*) EMOJI="🔍" ;;
    *razorpay*) EMOJI="💳" ;;
    *clickhouse*) EMOJI="🗄️" ;;
    *power-bi*) EMOJI="📊" ;;
    *clay*) EMOJI="🧱" ;;
    *zep*) EMOJI="🧠" ;;
    *upload*) EMOJI="📤" ;;
    *nano*) EMOJI="🍌" ;;
    *optimly*) EMOJI="⚡" ;;
  esac

  # Generate node-meta.json
  cat > "$TARGET_DIR/$FOLDER_NAME/node-meta.json" << EOF
{
  "slug": "$FOLDER_NAME",
  "name": "$DISPLAY_NAME",
  "package_name": "$PKG_NAME",
  "tagline": "$PKG_DESC",
  "description": "$PKG_DESC",
  "pain_point": "Community members requested a native n8n integration for $DISPLAY_NAME to avoid complex HTTP Request node setups with manual authentication handling.",
  "category": "$CATEGORY",
  "icon_emoji": "$EMOJI",
  "node_count": 1,
  "operations": $OPERATIONS,
  "credentials_type": $CRED_TYPE,
  "auth_type": "API Key",
  "n8n_version": "1.0+",
  "node_version": "$PKG_VERSION",
  "npm_url": null,
  "tags": $(node -e "const k=require('$PKG').keywords||[];console.log(JSON.stringify(k.filter(x=>x!=='n8n-community-node-package')))" 2>/dev/null || echo '[]'),
  "status": "beta",
  "is_featured": false
}
EOF

  # Generate README.md
  cat > "$TARGET_DIR/$FOLDER_NAME/README.md" << EOF
# $DISPLAY_NAME Node for n8n

$PKG_DESC

[![n8n community node](https://img.shields.io/badge/n8n-community%20node-FF6D5A)](https://n8n.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Installation

### From n8n UI (recommended)

1. Open your n8n instance
2. Go to **Settings → Community Nodes**
3. Click **Install a community node**
4. Enter: \`$PKG_NAME\`
5. Click **Install**

### From npm

\`\`\`bash
cd ~/.n8n
npm install $PKG_NAME
\`\`\`

Restart n8n after installation.

---

## Compatibility

| Requirement | Version |
|-------------|---------|
| n8n | 1.0+ |
| Node.js | 18+ |
| This package | $PKG_VERSION |

---

## License

MIT

---

Built by [BasitQ](https://basitq.cloud)
EOF

  echo "  ✓ Done ($CATEGORY)"
done

echo ""
echo "All nodes migrated. Building manifest..."
cd ~/Downloads/n8n-nodes-basitq
node scripts/build-manifest.js
node scripts/update-readme.js

echo ""
echo "Ready to push. Run:"
echo "  cd ~/Downloads/n8n-nodes-basitq"
echo "  git add -A && git commit -m 'feat: add 15 community nodes' && git push"
