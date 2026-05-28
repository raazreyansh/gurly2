import { prisma } from './prisma'

export async function autoSeedDatabase() {
  try {
    const existingCount = await prisma.product.count()
    if (existingCount > 0) {
      console.log("Database catalog already seeded with live products. Skipping auto seed.")
      return
    }

    console.log("Empty database catalog detected. Commencing live luxury seeding...")

    // 1. Create or resolve Category items
    let earrings = await prisma.category.findFirst({ where: { name: 'Earrings' } })
    if (!earrings) {
      earrings = await prisma.category.create({
        data: { name: 'Earrings', slug: 'earrings', imageUrl: '/images/models/community_1.png' }
      })
    }

    let necklaces = await prisma.category.findFirst({ where: { name: 'Necklaces' } })
    if (!necklaces) {
      necklaces = await prisma.category.create({
        data: { name: 'Necklaces', slug: 'necklaces', imageUrl: '/images/models/community_2.png' }
      })
    }

    let rings = await prisma.category.findFirst({ where: { name: 'Rings' } })
    if (!rings) {
      rings = await prisma.category.create({
        data: { name: 'Rings', slug: 'rings', imageUrl: '/images/models/community_3.png' }
      })
    }

    let bracelets = await prisma.category.findFirst({ where: { name: 'Bracelets' } })
    if (!bracelets) {
      bracelets = await prisma.category.create({
        data: { name: 'Bracelets', slug: 'bracelets', imageUrl: '/images/models/community_4.png' }
      })
    }

    // 2. Insert luxury catalog items with rich media JSON objects
    await prisma.product.createMany({
      data: [
        {
          title: "Royal Jhumka",
          slug: "royal-jhumka",
          description: "Exquisite handcrafted traditional jhumka earrings featuring premium micro-engraving.",
          price: 2999,
          compareAtPrice: 3999,
          stock: 12,
          featured: true,
          categoryId: earrings.id,
          media: [{ type: "image", url: "/images/models/community_1.png" }],
        },
        {
          title: "Luxury Pendant",
          slug: "luxury-pendant",
          description: "A striking minimalist pendant celebrating premium gold styling and crystal settings.",
          price: 4999,
          compareAtPrice: 5999,
          stock: 8,
          featured: true,
          categoryId: necklaces.id,
          media: [{ type: "image", url: "/images/models/community_2.png" }],
        },
        {
          title: "Prestige Solitaire Ring",
          slug: "prestige-ring",
          description: "Elegant modern premium solitaire ring crafted for statement occasions.",
          price: 1999,
          compareAtPrice: 2999,
          stock: 15,
          featured: true,
          categoryId: rings.id,
          media: [{ type: "image", url: "/images/models/community_3.png" }],
        },
        {
          title: "Classic Gold Choker",
          slug: "classic-choker",
          description: "A quietly bold statement choker necklace with hand-threaded accents.",
          price: 8999,
          compareAtPrice: 9999,
          stock: 5,
          featured: true,
          categoryId: necklaces.id,
          media: [{ type: "image", url: "/images/models/community_4.png" }],
        },
        {
          title: "Aura Hoop Earrings",
          slug: "aura-hoop-earrings",
          description: "Chunky editorial hoop earrings with modern high-fashion details.",
          price: 1499,
          compareAtPrice: 1999,
          stock: 20,
          featured: false,
          categoryId: earrings.id,
          media: [{ type: "image", url: "/images/models/community_1.png" }],
        },
        {
          title: "Serene Cuff Bracelet",
          slug: "serene-cuff-bracelet",
          description: "Minimalist gold cuff bracelet designed for modern luxury looks.",
          price: 2499,
          compareAtPrice: 3499,
          stock: 10,
          featured: false,
          categoryId: bracelets.id,
          media: [{ type: "image", url: "/images/models/community_4.png" }],
        }
      ]
    })

    console.log("Supabase database successfully seeded with dynamic luxury catalog!")
  } catch (err) {
    console.error("Auto seeding error:", err)
  }
}
