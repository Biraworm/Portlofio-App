#!/usr/bin/env node

/**
 * Script Node.js para verificar e iniciar o backend automaticamente
 * Executado antes do frontend iniciar
 */

const { execSync, spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const BACKEND_URL = 'http://localhost:4000';
const MAX_ATTEMPTS = 30;
const BACKEND_DIR = path.join(__dirname, '../apps/backend');

function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/health`, { timeout: 2000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureBackendRunning() {
  console.log('🔍 Verificando se o backend está rodando...');
  
  // Verificar se já está rodando
  for (let i = 0; i < 5; i++) {
    const isRunning = await checkBackend();
    if (isRunning) {
      console.log('✅ Backend já está rodando!');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('⚠️  Backend não está rodando. Tentando iniciar...');
  
  // Verificar se .env existe
  const envPath = path.join(BACKEND_DIR, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('📝 Criando arquivo .env...');
    fs.writeFileSync(envPath, `DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
FINNHUB_API_KEY=""
`);
  }
  
  // Verificar se node_modules existe
  const nodeModulesPath = path.join(BACKEND_DIR, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Instalando dependências do backend...');
    try {
      execSync('npm install', { 
        cwd: BACKEND_DIR, 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
      });
    } catch (error) {
      console.error('❌ Erro ao instalar dependências:', error.message);
      return false;
    }
  }
  
  // Iniciar backend
  console.log('🚀 Iniciando backend em background...');
  
  const backendProcess = spawn('npm', ['run', 'start:dev'], {
    cwd: BACKEND_DIR,
    stdio: 'pipe',
    detached: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Salvar PID
  const pidPath = path.join(__dirname, '../tmp/portfolio-backend.pid');
  const tmpDir = path.dirname(pidPath);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  fs.writeFileSync(pidPath, backendProcess.pid.toString());
  
  backendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Backend running') || output.includes('listening')) {
      console.log('✅ Backend iniciado!');
    }
  });
  
  backendProcess.stderr.on('data', (data) => {
    // Ignorar erros iniciais
  });
  
  backendProcess.unref();
  
  // Aguardar backend iniciar
  console.log('⏳ Aguardando backend iniciar...');
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isRunning = await checkBackend();
    if (isRunning) {
      console.log('✅ Backend está rodando!');
      console.log(`📡 Backend disponível em ${BACKEND_URL}`);
      return true;
    }
    if (i % 5 === 0 && i > 0) {
      process.stdout.write('.');
    }
  }
  
  console.log('\n⚠️  Backend não iniciou completamente, mas continuando...');
  console.log('💡 Se houver problemas, inicie manualmente: cd apps/backend && npm run start:dev');
  return false;
}

// Executar
ensureBackendRunning()
  .then((success) => {
    if (success) {
      process.exit(0);
    } else {
      // Continuar mesmo se não iniciou (pode estar iniciando)
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(0); // Continuar mesmo com erro
  });

