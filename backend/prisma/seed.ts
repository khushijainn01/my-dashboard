console.log("Seed started");
import prisma from "../src/lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      name: "Khushi Jain",
      email: "admin@gmail.com",
      password: "123456",
      role: "Admin",
    },
  });

  console.log("Admin User Created");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  