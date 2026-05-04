#!/usr/bin/env node

/**
 * update-readme.js
 * 
 * Reads manifest.json and updates the nodes table in README.md
 * between the NODES_TABLE_START and NODES_TABLE_END markers.
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'manifest.json');
const README_PATH = path.join(__dirname, '..', 'README.md');

function statusBadge(status) {
  const colors = {
    stable: '2ecc71',
    beta: 'f39c12',
    experimental: 'e74c3c',
    deprecated: '95a5a6'
  };
  const color = colors[status] || '95a5a6';
  return `![${status}](https://img.shields.io/badge/${status}-${color})`;
}

function run() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  let readme = fs.readFileSync(README_PATH, 'utf8');

  const header = '| Node | Description | Version | Status |\n|------|-------------|---------|--------|';
  
  const rows = manifest.nodes.map(node => {
    const link = `[${node.icon_emoji || '📦'} **${node.name}**](./nodes/${node.folder})`;
    return `| ${link} | ${node.tagline} | ${node.node_version} | ${statusBadge(node.status)} |`;
  });

  const table = [header, ...rows].join('\n');

  const startMarker = '<!-- NODES_TABLE_START -->';
  const endMarker = '<!-- NODES_TABLE_END -->';
  
  const startIdx = readme.indexOf(startMarker);
  const endIdx = readme.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find table markers in README.md');
    process.exit(1);
  }

  readme = readme.substring(0, startIdx + startMarker.length) +
    '\n' + table + '\n' +
    readme.substring(endIdx);

  fs.writeFileSync(README_PATH, readme);
  console.log(`README updated with ${manifest.nodes.length} node(s) in table.`);
}

run();
