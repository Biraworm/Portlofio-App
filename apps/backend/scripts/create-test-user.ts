import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env file in backend directory
dotenv.config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

async function createTestUser() {
  const email = 'test@example.com'
  const password = 'test123456'

  console.log('🔍 Verificando conexão com o banco de dados...')
  console.log(`📡 DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurado' : 'NÃO CONFIGURADO'}`)

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Conexão com o banco estabelecida!')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('\n✅ Usuário já existe:')
      console.log(`   📧 Email: ${existingUser.email}`)
      console.log(`   🆔 ID: ${existingUser.id}`)
      console.log(`   📅 Criado em: ${existingUser.createdAt}`)
      console.log(`   👑 Admin: ${existingUser.isAdmin ? 'Sim' : 'Não'}`)
      console.log(`\n📝 Você pode fazer login com:`)
      console.log(`   📧 Email: ${email}`)
      console.log(`   🔑 Senha: ${password}`)
      return
    }

    // Hash password
    console.log('\n🔐 Criptografando senha...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    console.log('👤 Criando usuário de teste...')
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    })

    console.log('\n✅ Usuário de teste criado com sucesso!')
    console.log(`   📧 Email: ${user.email}`)
    console.log(`   🆔 ID: ${user.id}`)
    console.log(`   📅 Criado em: ${user.createdAt}`)
    console.log(`   👑 Admin: ${user.isAdmin ? 'Sim' : 'Não'}`)
    console.log(`\n📝 Você pode fazer login com:`)
    console.log(`   📧 Email: ${email}`)
    console.log(`   🔑 Senha: ${password}`)
    console.log(`\n🚀 Agora você pode testar o login no frontend!`)
  } catch (error: any) {
    console.error('\n❌ Erro ao criar usuário de teste:', error.message)
    
    if (error.code === 'P1001') {
      console.error('\n💡 Dica: Verifique se:')
      console.error('   1. O DATABASE_URL está correto no arquivo .env')
      console.error('   2. O banco de dados está acessível')
      console.error('   3. As credenciais estão corretas')
    } else if (error.code === 'P2002') {
      console.error('\n💡 O usuário já existe no banco de dados')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n👋 Conexão fechada.')
  }
}

createTestUser()
