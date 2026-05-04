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

  const responseText = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(`Response: ${responseText}`);

  if (!response.ok) {
    console.error(`Sync failed: ${response.status}`);
    process.exit(1);
  }

  try {
    const result = JSON.parse(responseText);
    console.log(`\nDone. ${result.success} synced, ${result.failed} failed.`);
    if (result.failed > 0) process.exit(1);
  } catch {
    console.log('\nSync complete.');
  }
}

sync();
