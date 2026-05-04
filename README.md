# BasitQ — Custom n8n Community Nodes

[![Nodes](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbasitq%2Fn8n-nodes%2Fmain%2Fmanifest.json&query=%24.total_nodes&label=nodes&color=FF6D5A)](https://basitq.cloud/nodes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n](https://img.shields.io/badge/n8n-community%20nodes-FF6D5A)](https://n8n.io)

Research-driven n8n community nodes. Each one solves a real gap identified through Reddit, GitHub issues, and n8n forum research.

🌐 **Browse all nodes:** [basitq.cloud/nodes](https://basitq.cloud/nodes)

---

## Available Nodes

<!-- AUTO-GENERATED: Do not edit below this line. Updated by scripts/update-readme.js -->
<!-- NODES_TABLE_START -->
| Node | Description | Version | Status |
|------|-------------|---------|--------|
<!-- NODES_TABLE_END -->

---

## How to Install Any Node

### From n8n UI (recommended)

1. Open your n8n instance
2. Go to **Settings → Community Nodes**
3. Click **Install a community node**
4. Enter the package name (listed on each node's page)
5. Click **Install**

### From npm

```bash
cd ~/.n8n
npm install <package-name>
# Restart n8n
```

---

## How This Repo Works

This is a monorepo managed by the **Node Hunter** — an automated agent that:

1. Researches pain points on Reddit, GitHub issues, and the n8n community forum
2. Identifies gaps in the n8n node ecosystem
3. Scaffolds production-ready TypeScript nodes
4. Runs automated tests
5. Pushes to this repo
6. Auto-syncs metadata to [basitq.cloud/nodes](https://basitq.cloud/nodes)

Each node lives in its own folder under `nodes/` with a self-contained package structure ready for independent npm publishing.

### Repo structure

```
n8n-nodes/
├── manifest.json              # Auto-generated catalog of all nodes
├── nodes/
│   ├── n8n-nodes-firecrawl/   # Each node is a standalone package
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── nodes/
│   │   ├── credentials/
│   │   ├── examples/
│   │   └── ...
│   ├── n8n-nodes-apify/
│   └── ...
├── scripts/
│   ├── build-manifest.js      # Generates manifest.json from node folders
│   ├── update-readme.js       # Updates the nodes table in this README
│   └── sync-to-supabase.js   # Pushes manifest data to Supabase
└── .github/
    └── workflows/
        └── sync.yml           # Runs on push to sync everything
```

---

## Contributing

Found a service that should have an n8n node? [Open an issue](../../issues/new?template=node-request.md) or reach out at [basitq.cloud/contact](https://basitq.cloud/contact).

---

## License

MIT — see [LICENSE](./LICENSE) for details.

Built by [BasitQ](https://basitq.cloud) — solving real automation gaps, one node at a time.
