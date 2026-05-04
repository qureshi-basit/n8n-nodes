# Node Hunter Agent — Push Instructions

This document tells the Node Hunter agent how to add a new node to this repository so it automatically appears on basitq.cloud/nodes.

---

## Step-by-step: Adding a new node

### 1. Clone (if not already cloned)

```bash
git clone https://github.com/basitq/n8n-nodes.git
cd n8n-nodes
```

### 2. Create the node folder

```bash
# Copy the template
cp -r _template nodes/n8n-nodes-<service-name>
cd nodes/n8n-nodes-<service-name>
```

Naming convention: `n8n-nodes-<service>` (lowercase, hyphens, no underscores).

### 3. Build the node

Create these files inside `nodes/n8n-nodes-<service>/`:

```
n8n-nodes-<service>/
├── node-meta.json          ← REQUIRED: fill every field (see schema below)
├── package.json             ← REQUIRED: standard n8n node package.json
├── README.md                ← REQUIRED: use the README template from _template/
├── tsconfig.json
├── nodes/
│   └── <ServiceName>/
│       ├── <ServiceName>.node.ts
│       ├── <ServiceName>.node.json  (codex file)
│       └── <service>.svg            (60x60 icon)
├── credentials/
│   └── <ServiceName>Api.credentials.ts
└── examples/
    └── basic-workflow.json  ← REQUIRED: at least one example workflow
```

### 4. Fill node-meta.json

This is the file the website reads. Every field matters:

```json
{
  "slug": "n8n-nodes-firecrawl",
  "name": "Firecrawl",
  "package_name": "n8n-nodes-firecrawl",
  "tagline": "Scrape, crawl, and extract structured data from any website",
  "description": "Markdown description of what this node does...",
  "pain_point": "Users on Reddit and the n8n forum repeatedly asked for...",
  "category": "Data & Scraping",
  "icon_emoji": "🔥",
  "node_count": 1,
  "operations": ["Scrape URL", "Crawl Site", "Extract Data"],
  "credentials_type": "firecrawlApi",
  "auth_type": "API Key",
  "n8n_version": "1.0+",
  "node_version": "1.0.0",
  "npm_url": null,
  "tags": ["scraping", "ai", "web"],
  "status": "stable",
  "is_featured": false
}
```

**Category** must be one of:
- AI & LLM
- Data & Scraping
- Communication
- CRM & Sales
- DevOps
- Finance
- Productivity
- Social Media
- Other

**Status** must be one of: stable, beta, experimental, deprecated

**pain_point** — write 2-3 sentences about the specific community need. Reference where you found it (Reddit, n8n forum, GitHub issues). This appears on the website as the story behind the node.

### 5. Create the example workflow

Save at least one example workflow in `examples/basic-workflow.json`. This gets displayed on the website using n8n's own canvas renderer. The workflow should:

- Use a Manual Trigger as the starting node
- Include the custom node with realistic parameters
- Be a complete, importable workflow
- Have descriptive node names

### 6. Push

From the repo root:

```bash
./scripts/agent-push.sh n8n-nodes-<service>
```

Or manually:

```bash
node scripts/build-manifest.js
node scripts/update-readme.js
git add -A
git commit -m "feat: add <ServiceName> node"
git push origin main
```

### 7. What happens automatically

1. GitHub Action fires on push to main
2. `build-manifest.js` regenerates `manifest.json`
3. `update-readme.js` updates the README nodes table
4. `sync-to-supabase.js` upserts node data into Supabase `custom_nodes` table
5. basitq.cloud/nodes reads from Supabase and displays the node

**Time from push to live on website: ~60 seconds.**

---

## Updating an existing node

1. Edit any files in `nodes/n8n-nodes-<service>/`
2. Update `node_version` in `node-meta.json`
3. Push to main — the pipeline handles the rest

## Removing a node

1. Delete the folder from `nodes/`
2. Push to main — the sync script removes it from Supabase too

---

## Checklist before pushing

- [ ] `node-meta.json` has all required fields filled
- [ ] `package.json` has correct `n8n` field with node/credential paths
- [ ] `README.md` exists with installation instructions
- [ ] At least one example workflow in `examples/`
- [ ] TypeScript compiles: `cd nodes/n8n-nodes-<service> && npm run build`
- [ ] `pain_point` field tells a real story (not generic filler)
- [ ] `operations` array matches actual node operations
- [ ] `slug` matches the folder name
