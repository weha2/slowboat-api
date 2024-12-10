import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.product.count();
    if (!count) {
      await prisma.product.createMany({
        data: [
          {
            name: '⛵Slowboat',
            price: 1700,
          },
          {
            name: '🚃Bus',
            price: 1600,
          },
          {
            name: '🚝Train',
            price: 1990,
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
