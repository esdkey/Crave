import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL;
const isPostgres = !!url && url.startsWith("postgres");
const adapter = isPostgres
  ? new PrismaPg({ connectionString: url })
  : new PrismaBetterSqlite3({ url: url ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed admin user
  const email = (process.env.ADMIN_EMAIL || "ismail@crave.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "crave-admin-123";
  const name = process.env.ADMIN_NAME || "Crave Admin";

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash: hash, role: "ADMIN" },
  });
  console.log(`✓ Admin user ensured: ${email}`);

  const demoProducts = [
    {
      slug: "oud-royal",
      nameAr: "عود رويال",
      nameEn: "Oud Royal",
      descriptionAr: "عطر شرقي فاخر يجمع بين العود الأصيل والمسك والوردة الدمشقية.",
      descriptionEn:
        "A luxurious oriental fragrance blending authentic oud, musk, and Damask rose.",
      storyAr: "قصة هذا العطر مستوحاة من فخامة القصور الشرقية ودفء العود النادر.",
      storyEn:
        "This fragrance is inspired by the grandeur of oriental palaces and the warmth of rare oud.",
      price: 850,
      stock: 20,
      featured: true,
    },
    {
      slug: "amber-nuit",
      nameAr: "أمبر نايت",
      nameEn: "Amber Nuit",
      descriptionAr: "عطر دافئ من العنبر والفانيليا مع لمسة من خشب الصندل.",
      descriptionEn:
        "A warm fragrance of amber and vanilla with a touch of sandalwood.",
      storyAr: "ليلة هادئة تتخللها رائحة العنبر الدافئ، تترك أثرًا لا يُنسى.",
      storyEn:
        "A calm night laced with warm amber, leaving an unforgettable trail.",
      price: 720,
      stock: 15,
      featured: true,
    },
    {
      slug: "rose-de-crete",
      nameAr: "روز دي كريت",
      nameEn: "Rose de Crete",
      descriptionAr: "عطر عصري من الورد والبرغموت يناسب الاستخدام اليومي.",
      descriptionEn:
        "A modern fragrance of rose and bergamot for everyday wear.",
      storyAr: "زهرة براقة تُضيء يومك بلمسة من الأناقة البسيطة.",
      storyEn: "A radiant floral that brightens your day with simple elegance.",
      price: 640,
      stock: 30,
      featured: true,
    },
  ];

  for (const p of demoProducts) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          slug: p.slug,
          nameAr: p.nameAr,
          nameEn: p.nameEn,
          descriptionAr: p.descriptionAr,
          descriptionEn: p.descriptionEn,
          storyAr: p.storyAr,
          storyEn: p.storyEn,
          price: p.price,
          stock: p.stock,
          featured: p.featured,
          isAvailable: true,
        },
      });
      console.log(`✓ Product created: ${p.slug}`);
    } else {
      console.log(`- Product exists: ${p.slug}`);
    }
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
