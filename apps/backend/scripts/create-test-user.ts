import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function createTestUser() {
  const email = 'test@example.com'
  const password = 'test123456'

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('✅ User already exists:')
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   ID: ${existingUser.id}`)
      console.log(`   Created: ${existingUser.createdAt}`)
      console.log(`\n📝 You can login with:`)
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    })

    console.log('✅ Test user created successfully!')
    console.log(`   Email: ${user.email}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Created: ${user.createdAt}`)
    console.log(`\n📝 You can now login with:`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
  } catch (error) {
    console.error('❌ Error creating test user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()

