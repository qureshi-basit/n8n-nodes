#!/usr/bin/env node

/**
 * build-manifest.js
 * 
 * Scans all node folders under nodes/, reads each node-meta.json,
 * collects example workflows, and generates the root manifest.json.
 * 
 * Run: node scripts/build-manifest.js
 * Called automatically by the GitHub Action on every push.
 */

const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'qureshi-basit';
const REPO_NAME = 'n8n-nodes';
const NODES_DIR = path.join(__dirname, '..', 'nodes');
const MANIFEST_PATH = path.join(__dirname, '..', 'manifest.json');

function findExampleWorkflow(nodeDir) {
  const examplesDir = path.join(nodeDir, 'examples');
  if (!fs.existsSync(examplesDir)) return null;

  const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) return null;

  try {
    const firstExample = fs.readFileSync(path.join(examplesDir, files[0]), 'utf8');
    return JSON.parse(firstExample);
  } catch (e) {
    console.warn(`  Warning: Could not parse example workflow in ${nodeDir}: ${e.message}`);
    return null;
  }
}

function getReadme(nodeDir) {
  const readmePath = path.join(nodeDir, 'README.md');
  if (!fs.existsSync(readmePath)) return null;
  return fs.readFileSync(readmePath, 'utf8');
}

function buildManifest() {
  console.log('Building manifest...\n');

  if (!fs.existsSync(NODES_DIR)) {
    console.log('No nodes/ directory found. Creating empty manifest.');
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify({
      schema_version: '1.0.0',
      repo: `${REPO_OWNER}/${REPO_NAME}`,
      website: 'https://basitq.cloud/nodes',
      total_nodes: 0,
      last_updated: new Date().toISOString(),
      nodes: []
    }, null, 2));
    return;
  }

  const nodeDirs = fs.readdirSync(NODES_DIR).filter(dir => {
    const fullPath = path.join(NODES_DIR, dir);
    return fs.statSync(fullPath).isDirectory() && 
           fs.existsSync(path.join(fullPath, 'node-meta.json'));
  });

  console.log(`Found ${nodeDirs.length} node(s):\n`);

  const nodes = [];

  for (const dir of nodeDirs) {
    const nodeDir = path.join(NODES_DIR, dir);
    const metaPath = path.join(nodeDir, 'node-meta.json');
    
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      
      // Strip schema comment fields
      delete meta['$schema'];
      delete meta['_comment'];
      delete meta['_category_options'];
      delete meta['_auth_type_options'];
      delete meta['_status_options'];

      // Enrich with computed fields
      const nodeEntry = {
        ...meta,
        folder: dir,
        github_url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/main/nodes/${dir}`,
        raw_readme_url: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/nodes/${dir}/README.md`,
        demo_workflow_json: findExampleWorkflow(nodeDir),
        has_readme: fs.existsSync(path.join(nodeDir, 'README.md')),
        published_at: getGitFirstCommitDate(nodeDir) || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      nodes.push(nodeEntry);
      console.log(`  ✓ ${meta.name} (${meta.package_name}) — ${meta.status}`);
    } catch (e) {
      console.error(`  ✗ Error processing ${dir}: ${e.message}`);
    }
  }

  const manifest = {
    schema_version: '1.0.0',
    repo: `${REPO_OWNER}/${REPO_NAME}`,
    website: 'https://basitq.cloud/nodes',
    total_nodes: nodes.length,
    last_updated: new Date().toISOString(),
    nodes: nodes.sort((a, b) => a.name.localeCompare(b.name))
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written with ${nodes.length} node(s).`);
}

function getGitFirstCommitDate(nodeDir) {
  try {
    const { execSync } = require('child_process');
    const result = execSync(
      `git log --follow --format=%aI --diff-filter=A -- "${nodeDir}" | tail -1`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    return result || null;
  } catch {
    return null;
  }
}

buildManifest();
