#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'manifest.json');

async function sync() {
  const syncUrl = process.env.SYNC_URL;
  const syncToken = process.env.SYNC_TOKEN;

  if (!syncUrl || !syncToken) {
    console.error('Missing SYNC_URL or SYNC_TOKEN env vars');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  console.log(`Syncing ${manifest.nodes.length} node(s) via Edge Function...\n`);

  const response = await fetch(syncUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${syncToken}`
    },
    body: JSON.stringify({ nodes: manifest.nodes })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Sync failed: ${response.status} — ${error}`);
    process.exit(1);
  }

  const result = await response.json();
  console.log(`Done. ${result.success} synced, ${result.failed} failed.`);
  if (result.failed > 0) process.exit(1);
}

sync();
