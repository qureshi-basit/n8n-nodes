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
| [🤖 **Alchemyst Ai**](./nodes/n8n-nodes-alchemyst-ai) | n8n node for Alchemyst AI - Persistent memory for workflows | 0.1.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🤖 **Claude Pro**](./nodes/n8n-nodes-claude-pro) | n8n community node for Claude Pro/Max subscription integration | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🧱 **Clay**](./nodes/n8n-nodes-clay) | n8n community node for Clay - Data enrichment and lead generation platform | 0.1.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🗄️ **Clickhouse**](./nodes/n8n-nodes-clickhouse) | n8n community node for ClickHouse database operations | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🔍 **Google Ads**](./nodes/n8n-nodes-google-ads) | n8n community node for Google Ads API integration | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🔍 **Google Chat**](./nodes/n8n-nodes-google-chat) | n8n node for Google Chat integration | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🤖 **Gpt Image 1 5**](./nodes/n8n-nodes-gpt-image-1-5) | n8n community node for GPT Image 1.5 image generation | 0.1.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🍌 **Nano Banana**](./nodes/n8n-nodes-nano-banana) | n8n community node for Nano Banana - AI image/video generation service for creating ad creatives and product visuals | 0.1.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [⚡ **Optimly**](./nodes/n8n-nodes-optimly) | Analytics node for AI workflows with HTTP compatibility to track LLM inputs/outputs, errors, token usage, and user frustration | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [📊 **Power Bi**](./nodes/n8n-nodes-power-bi) | n8n community node for Power BI API integration | 0.1.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [📊 **Power Bi V2**](./nodes/n8n-nodes-power-bi-v2) | n8n node for Power BI integration with AI reasoning capabilities for querying models and automated insights | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [💳 **Razorpay**](./nodes/n8n-nodes-razorpay) | Native Razorpay payment integration for n8n workflows | 0.1.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [📤 **Upload To Url**](./nodes/n8n-nodes-upload-to-url) | n8n node for uploading binary files to CDN and getting public URLs | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🧠 **Zep Memory**](./nodes/n8n-nodes-zep-memory) | n8n community node for Zep Memory - AI memory service for workflows | 0.1.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
| [🧠 **Zep Memory V2**](./nodes/n8n-nodes-zep-memory-v2) | n8n node for Zep Memory service - AI conversation memory management | 1.0.0 | ![beta](https://img.shields.io/badge/beta-f39c12) |
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
