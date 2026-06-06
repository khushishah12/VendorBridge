import { PrismaClient, Role, UserStatus, VendorStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding showcase accounts...')

  // Salt and hash the standard password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash('Password123!', salt)

  // 1. System Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vendorbridge.io' },
    update: {
      password: hashedPassword,
      name: 'System Administrator',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
    create: {
      email: 'admin@vendorbridge.io',
      password: hashedPassword,
      name: 'System Administrator',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  })
  console.log(`Upserted admin: ${admin.email}`)

  // 2. Workflow Manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@vendorbridge.io' },
    update: {
      password: hashedPassword,
      name: 'Senior Manager',
      role: Role.MANAGER,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
    create: {
      email: 'manager@vendorbridge.io',
      password: hashedPassword,
      name: 'Senior Manager',
      role: Role.MANAGER,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  })
  console.log(`Upserted manager: ${manager.email}`)

  // 3. Procurement Officer
  const procurement = await prisma.user.upsert({
    where: { email: 'procurement@vendorbridge.io' },
    update: {
      password: hashedPassword,
      name: 'Procurement Officer',
      role: Role.PROCUREMENT_OFFICER,
      status: UserStatus.ACTIVE,
      department: 'Global Sourcing',
      companyName: 'VendorBridge Corp',
      gstNumber: '27AAAAA1111A1Z1',
      isVerified: true,
    },
    create: {
      email: 'procurement@vendorbridge.io',
      password: hashedPassword,
      name: 'Procurement Officer',
      role: Role.PROCUREMENT_OFFICER,
      status: UserStatus.ACTIVE,
      department: 'Global Sourcing',
      companyName: 'VendorBridge Corp',
      gstNumber: '27AAAAA1111A1Z1',
      isVerified: true,
    },
  })
  console.log(`Upserted procurement officer: ${procurement.email}`)

  // 4. Vendor Partner (with profile)
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@vendorbridge.io' },
    update: {
      password: hashedPassword,
      name: 'Vendor Partner',
      role: Role.VENDOR,
      status: UserStatus.ACTIVE,
      companyName: 'TechSolutions Inc.',
      gstNumber: '27BBBBB2222B2Z2',
      isVerified: true,
    },
    create: {
      email: 'vendor@vendorbridge.io',
      password: hashedPassword,
      name: 'Vendor Partner',
      role: Role.VENDOR,
      status: UserStatus.ACTIVE,
      companyName: 'TechSolutions Inc.',
      gstNumber: '27BBBBB2222B2Z2',
      isVerified: true,
    },
  })
  console.log(`Upserted vendor user: ${vendorUser.email}`)

  // Linked Vendor Profile
  const vendorProfile = await prisma.vendor.upsert({
    where: { email: 'vendor@vendorbridge.io' },
    update: {
      userId: vendorUser.id,
      companyName: 'TechSolutions Inc.',
      contactPerson: 'Vendor Partner',
      phone: '+91 98765 43210',
      gstNumber: '27BBBBB2222B2Z2',
      category: 'Electronics & Computing',
      status: VendorStatus.ACTIVE,
      rating: 4.8,
      successRate: 98.5,
    },
    create: {
      userId: vendorUser.id,
      companyName: 'TechSolutions Inc.',
      contactPerson: 'Vendor Partner',
      email: 'vendor@vendorbridge.io',
      phone: '+91 98765 43210',
      gstNumber: '27BBBBB2222B2Z2',
      category: 'Electronics & Computing',
      status: VendorStatus.ACTIVE,
      rating: 4.8,
      successRate: 98.5,
    },
  })
  console.log(`Upserted vendor profile: ${vendorProfile.companyName}`)

  console.log('Database seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
