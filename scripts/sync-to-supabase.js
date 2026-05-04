#!/usr/bin/env node

/**
 * sync-to-supabase.js
 * 
 * Reads manifest.json and upserts all node data into the
 * custom_nodes table in Supabase. Called by the GitHub Action.
 * 
 * Required env vars:
 *   SUPABASE_URL      — your Supabase project URL
 *   SUPABASE_KEY      — service_role key (NOT anon key)
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'manifest.json');

async function sync() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY env vars');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  console.log(`Syncing ${manifest.nodes.length} node(s) to Supabase...\n`);

  let success = 0;
  let failed = 0;

  for (const node of manifest.nodes) {
    const row = {
      slug: node.slug,
      name: node.name,
      package_name: node.package_name,
      tagline: node.tagline,
      description: node.description,
      pain_point: node.pain_point || null,
      category: node.category,
      icon_emoji: node.icon_emoji || '📦',
      node_count: node.node_count || 1,
      operations: node.operations || [],
      credentials_type: node.credentials_type || null,
      auth_type: node.auth_type || 'None',
      n8n_version: node.n8n_version || '1.0+',
      node_version: node.node_version || '1.0.0',
      github_url: node.github_url,
      npm_url: node.npm_url || null,
      demo_workflow_json: node.demo_workflow_json || null,
      installation_method: 'community',
      tags: node.tags || [],
      status: node.status || 'stable',
      is_featured: node.is_featured || false,
      published_at: node.published_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      // Upsert by slug
      const response = await fetch(`${supabaseUrl}/rest/v1/custom_nodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(row)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }

      console.log(`  ✓ ${node.name}`);
      success++;
    } catch (e) {
      console.error(`  ✗ ${node.name}: ${e.message}`);
      failed++;
    }
  }

  // Delete nodes from Supabase that are no longer in the manifest
  const activeSlugs = manifest.nodes.map(n => n.slug);
  try {
    const deleteUrl = `${supabaseUrl}/rest/v1/custom_nodes?slug=not.in.(${activeSlugs.map(s => `"${s}"`).join(',')})`;
    const delResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    if (delResponse.ok) {
      console.log('\n  Cleaned up removed nodes from Supabase.');
    }
  } catch (e) {
    console.warn(`  Warning: Could not clean up old nodes: ${e.message}`);
  }

  console.log(`\nDone. ${success} synced, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

sync();
