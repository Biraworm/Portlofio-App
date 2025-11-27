/**
 * Script alternativo para criar usuário de teste via API do backend
 * Use este script se o script direto não funcionar devido a problemas de conexão
 * 
 * Pré-requisito: Backend deve estar rodando em http://localhost:4000
 */

import axios from 'axios'

const API_URL = process.env.API_URL || 'http://localhost:4000'
const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'test123456'

async function createTestUserViaAPI() {
  console.log('🔍 Tentando criar usuário de teste via API...')
  console.log(`📡 API URL: ${API_URL}`)

  try {
    // Try to register the user
    const response = await axios.post(`${API_URL}/auth/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    })

    if (response.data.accessToken) {
      console.log('\n✅ Usuário de teste criado com sucesso via API!')
      console.log(`   📧 Email: ${TEST_EMAIL}`)
      console.log(`   🔑 Senha: ${TEST_PASSWORD}`)
      console.log(`   🆔 ID: ${response.data.user?.id || 'N/A'}`)
      console.log(`\n📝 Você pode fazer login com:`)
      console.log(`   📧 Email: ${TEST_EMAIL}`)
      console.log(`   🔑 Senha: ${TEST_PASSWORD}`)
      console.log(`\n🚀 Agora você pode testar o login no frontend!`)
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log('\n✅ Usuário de teste já existe!')
      console.log(`   📧 Email: ${TEST_EMAIL}`)
      console.log(`\n📝 Você pode fazer login com:`)
      console.log(`   📧 Email: ${TEST_EMAIL}`)
      console.log(`   🔑 Senha: ${TEST_PASSWORD}`)
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Erro: Não foi possível conectar ao backend')
      console.error(`   Verifique se o backend está rodando em ${API_URL}`)
      console.error(`   Execute: cd apps/backend && npm run start:dev`)
    } else {
      console.error('\n❌ Erro ao criar usuário:', error.response?.data?.message || error.message)
    }
    process.exit(1)
  }
}

createTestUserViaAPI()

