import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Connecting to Neon PostgreSQL database...')
  try {
    const userCount = await prisma.user.count()
    const vendorCount = await prisma.vendor.count()
    const rfqCount = await prisma.rFQ.count()
    const quotationCount = await prisma.quotation.count()

    console.log('\n======================================')
    console.log('     DATABASE VERIFICATION STATUS     ')
    console.log('======================================')
    console.log(`Users:       ${userCount}`)
    console.log(`Vendors:     ${vendorCount}`)
    console.log(`RFQs:        ${rfqCount}`)
    console.log(`Quotations:  ${quotationCount}`)
    console.log('======================================\n')
  } catch (error) {
    console.error('Error connecting to the Neon PostgreSQL database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
