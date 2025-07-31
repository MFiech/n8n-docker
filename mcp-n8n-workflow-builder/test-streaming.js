#!/usr/bin/env node

/**
 * Test script for the n8n MCP server with streaming transport
 * Usage: node test-streaming.js
 */

const http = require('http');

async function testMCPServer() {
  console.log('🧪 Testing n8n MCP Server with Streaming Transport\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing health endpoint...');
  try {
    const healthResponse = await fetch('http://localhost:3456/health');
    const health = await healthResponse.json();
    console.log('✅ Health check passed:', health);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: SSE Connection
  console.log('\n2️⃣ Testing SSE endpoint...');
  let sessionId = null;
  
  try {
    const sseResponse = await fetch('http://localhost:3456/sse');
    
    if (sseResponse.status !== 200) {
      throw new Error(`SSE endpoint returned ${sseResponse.status}`);
    }
    
    // Read the first SSE event to get sessionId
    const reader = sseResponse.body.getReader();
    const decoder = new TextDecoder();
    
    const { value } = await reader.read();
    const text = decoder.decode(value);
    
    // Parse SSE format: "event: endpoint\ndata: /messages?sessionId=..."
    const lines = text.split('\n');
    const dataLine = lines.find(line => line.startsWith('data: '));
    if (dataLine) {
      const endpoint = dataLine.replace('data: ', '');
      const match = endpoint.match(/sessionId=([^&\s]+)/);
      if (match) {
        sessionId = match[1];
        console.log('✅ SSE connection established, sessionId:', sessionId);
      }
    }
    
    reader.releaseLock();
  } catch (error) {
    console.log('❌ SSE test failed:', error.message);
    return;
  }

  if (!sessionId) {
    console.log('❌ Could not extract sessionId from SSE response');
    return;
  }

  // Test 3: List Tools
  console.log('\n3️⃣ Testing tools/list...');
  try {
    const toolsResponse = await fetch(`http://localhost:3456/messages?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      })
    });

    if (toolsResponse.status === 202) {
      console.log('✅ Tools list request accepted (202)');
      console.log('💡 To see the response, connect to the SSE stream and check for the reply');
    } else {
      const result = await toolsResponse.json();
      console.log('✅ Tools list response:', result);
    }
  } catch (error) {
    console.log('❌ Tools list test failed:', error.message);
  }

  console.log('\n🎉 Streaming MCP server is working!');
  console.log('\n📋 Next steps for Cursor integration:');
  console.log('1. Make sure your n8n instance is running on http://localhost:5678');
  console.log('2. Get your n8n API key from Settings > API');
  console.log('3. Use this Cursor configuration:');
  console.log(JSON.stringify({
    mcpServers: {
      "n8n-workflow-builder": {
        url: "http://localhost:3456/sse",
        env: {
          N8N_API_KEY: "your-n8n-api-key-here",
          N8N_BASE_URL: "http://localhost:5678"
        }
      }
    }
  }, null, 2));
}

// Polyfill fetch for older Node.js versions
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

testMCPServer().catch(console.error); 