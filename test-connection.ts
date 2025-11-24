// test-connection.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...')
    
    // Conectar a la base de datos
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test 1: Contar categorías
    const categoryCount = await prisma.category.count()
    console.log(`✅ Categories in database: ${categoryCount}`)
    
    // Test 2: Contar productos
    const productCount = await prisma.product.count()
    console.log(`✅ Products in database: ${productCount}`)
    
    // Test 3: Obtener algunas categorías con productos
    const categories = await prisma.category.findMany({
      take: 3,
      include: {
        products: {
          take: 2
        }
      }
    })
    
    console.log('✅ Sample data:')
    categories.forEach(category => {
      console.log(`   - ${category.name}: ${category.products.length} products`)
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error('Error details:', error)
    
    // Información útil para debugging
    console.log('\n🔧 Debug information:')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    if (process.env.DATABASE_URL) {
      const dbUrl = process.env.DATABASE_URL
      console.log('Database host:', dbUrl.split('@')[1]?.split('/')[0] || 'Cannot parse')
    }
    
    return false
    
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  }
}

// Ejecutar la prueba
testConnection()
  .then(success => {
    console.log(success ? '🎉 All tests passed!' : '💥 Tests failed')
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error)
    process.exit(1)
  })