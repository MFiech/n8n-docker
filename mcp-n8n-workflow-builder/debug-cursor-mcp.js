#!/usr/bin/env node

/**
 * Debug script to simulate Cursor's MCP connection process
 * This will help diagnose why "0 tools enabled" appears in Cursor
 */

const EventSource = require('eventsource');
const fetch = require('node-fetch');

async function debugCursorMCPConnection() {
  console.log('🔍 Debugging Cursor MCP Connection\n');
  
  const baseUrl = 'http://localhost:3456';
  let sessionId = null;

  // Step 1: Test SSE Connection (like Cursor does)
  console.log('1️⃣ Testing SSE Connection...');
  
  try {
    const eventSource = new EventSource(`${baseUrl}/sse`);
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        eventSource.close();
        reject(new Error('SSE connection timeout'));
      }, 5000);
      
      eventSource.onopen = () => {
        console.log('✅ SSE connection opened');
      };
      
      eventSource.onmessage = (event) => {
        console.log('📨 SSE message received:', event.data);
        
        // Extract sessionId from endpoint message
        if (event.type === 'endpoint' || event.data.includes('sessionId=')) {
          const match = event.data.match(/sessionId=([^&\s]+)/);
          if (match) {
            sessionId = match[1];
            console.log(`✅ Session ID extracted: ${sessionId}`);
          }
        }
        
        clearTimeout(timeout);
        eventSource.close();
        resolve();
      };
      
      eventSource.onerror = (error) => {
        console.log('❌ SSE error:', error);
        clearTimeout(timeout);
        eventSource.close();
        reject(error);
      };
    });
    
  } catch (error) {
    console.log('❌ SSE connection failed:', error.message);
    return;
  }

  if (!sessionId) {
    console.log('❌ No session ID received from SSE');
    return;
  }

  // Step 2: Initialize MCP Protocol
  console.log('\n2️⃣ Initializing MCP Protocol...');
  
  try {
    const initResponse = await fetch(`${baseUrl}/messages?sessionId=${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          clientInfo: {
            name: 'cursor-debug',
            version: '1.0.0'
          }
        }
      })
    });

    if (initResponse.status === 202) {
      console.log('✅ Initialize request accepted (202)');
    } else {
      const result = await initResponse.json();
      console.log('📋 Initialize response:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.log('❌ Initialize failed:', error.message);
  }

  // Step 3: List Tools
  console.log('\n3️⃣ Listing Available Tools...');
  
  try {
    const toolsResponse = await fetch(`${baseUrl}/messages?sessionId=${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
      })
    });

    if (toolsResponse.status === 202) {
      console.log('✅ Tools list request accepted (202)');
      console.log('💡 Response will be sent via SSE stream');
    } else {
      const result = await toolsResponse.json();
      console.log('📋 Tools list response:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.log('❌ Tools list failed:', error.message);
  }

  // Step 4: Listen for responses via SSE
  console.log('\n4️⃣ Listening for MCP responses via SSE...');
  
  try {
    const eventSource = new EventSource(`${baseUrl}/sse`);
    
    let messageCount = 0;
    const maxMessages = 5;
    
    eventSource.onmessage = (event) => {
      messageCount++;
      console.log(`📨 SSE Response ${messageCount}:`, event.data);
      
      try {
        const data = JSON.parse(event.data);
        if (data.method === 'tools/list' || (data.result && data.result.tools)) {
          console.log('🎯 Found tools response!');
          if (data.result && data.result.tools) {
            console.log(`📊 Found ${data.result.tools.length} tools:`);
            data.result.tools.forEach((tool, i) => {
              console.log(`   ${i + 1}. ${tool.name}: ${tool.description}`);
            });
          }
        }
      } catch (e) {
        // Not JSON, probably a session message
      }
      
      if (messageCount >= maxMessages) {
        eventSource.close();
      }
    };
    
    // Wait for a few seconds to collect responses
    await new Promise(resolve => setTimeout(resolve, 3000));
    eventSource.close();
    
  } catch (error) {
    console.log('❌ SSE listening failed:', error.message);
  }

  // Step 5: Test direct tools/list call
  console.log('\n5️⃣ Testing direct tools/list (fallback)...');
  
  try {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      })
    });
    
    const result = await response.json();
    console.log('📋 Direct tools/list response:', JSON.stringify(result, null, 2));
    
    if (result.result && result.result.tools) {
      console.log(`🎯 Found ${result.result.tools.length} tools via direct call!`);
    }
    
  } catch (error) {
    console.log('❌ Direct tools/list failed:', error.message);
  }

  console.log('\n📋 Debugging Summary:');
  console.log(`- Server URL: ${baseUrl}/sse`);
  console.log(`- Session ID: ${sessionId || 'Not obtained'}`);
  console.log('- Check the SSE responses above for tool listings');
  console.log('- If no tools are shown, the n8n connection might be failing');
  
  console.log('\n🔧 Next steps if "0 tools enabled":');
  console.log('1. Check if n8n is running on http://localhost:5678');
  console.log('2. Verify N8N_API_KEY is correct');
  console.log('3. Check server logs for connection errors');
}

// Install dependencies if needed
try {
  require('eventsource');
  require('node-fetch');
} catch (error) {
  console.log('📦 Installing required dependencies...');
  console.log('Run: npm install eventsource node-fetch');
  process.exit(1);
}

debugCursorMCPConnection().catch(console.error); 