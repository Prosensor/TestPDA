
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Admin Pharmacie Mozart',
        email: 'pharmaciemozart@gmail.com',
        password: 'b/TBrOajvjt5X2t08UrwgPZNgLzNbLyczJf0y',
      },
    });
    console.log('Utilisateur créé avec succès:', user);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    await prisma.();
  }
}

main();
