#!/usr/bin/env node

/**
 * CondoSmart Frontend - Script de Arranque Local
 * 
 * Este script te permite ejecutar el frontend sin necesidad de npm install
 * usando un servidor HTTP simple con soporte para React
 * 
 * USO:
 *   node start-dev-server.js
 * 
 * Luego abre: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const SRC_DIR = path.join(__dirname, 'src');

// Tipos MIME
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP Server
const server = http.createServer((req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  // Build file path
  let filePath = path.join(PUBLIC_DIR, pathname);

  // If directory, try to serve index.html
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (err) {
    // File doesn't exist, try index.html for SPA routing
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // 404 - Not Found
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Not Found</h1>', 'utf-8');
      return;
    }

    // Determine content type
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    // Set response headers
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    res.end(content, 'utf-8');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 CondoSmart Frontend - Dev Server              ║
║                                                            ║
║  URL:     http://localhost:${PORT}                          ║
║  API:     http://localhost:8000/api/v1                    ║
║                                                            ║
║  Credenciales de Prueba:                                  ║
║  Usuario: admin@condosmart.com                            ║
║  Contraseña: admin123                                     ║
║                                                            ║
║  Presiona Ctrl+C para detener                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);

  console.log(`📁 Sirviendo archivos desde: ${PUBLIC_DIR}`);
  console.log(`\n✅ Servidor listo en http://localhost:${PORT}`);
});

// Handle errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Puerto ${PORT} ya está en uso`);
    console.log(`\n💡 Prueba con otro puerto:`);
    console.log(`   PORT=3001 node start-dev-server.js`);
  } else {
    console.error('❌ Error del servidor:', err);
  }
  process.exit(1);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Servidor detenido');
  process.exit(0);
});
