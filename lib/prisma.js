import { PrismaClient } from '@prisma/client'
// import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = global 
const neon = new Pool({ connectionString: process.env.database_POSTGRES_PRISMA_URL })
const adapter = new PrismaNeon(neon)
export const prisma = globalForPrisma.prisma??new PrismaClient({ adapter })


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 

export default prisma 