import { prisma } from './prisma'

export async function autoSeedDatabase() {
  try {
    const categoryCount = await prisma.category.count()
    if (categoryCount > 0) return

    console.log("Seeding live Supabase database with editorial collections...")

    // 1. Create categories
    const earrings = await prisma.category.create({
      data: {
        name: "Earrings",
        slug: "earrings",
        imageUrl: "/images/models/community_1.png"
      }
    })

    const necklaces = await prisma.category.create({
      data: {
        name: "Necklaces",
        slug: "necklaces",
        imageUrl: "/images/models/community_2.png"
      }
    })

    const rings = await prisma.category.create({
      data: {
        name: "Rings",
        slug: "rings",
        imageUrl: "/images/models/community_3.png"
      }
    })

    const bracelets = await prisma.category.create({
      data: {
        name: "Bracelets",
        slug: "bracelets",
        imageUrl: "/images/models/community_4.png"
      }
    })

    // 2. Create products
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
          images: ["/images/models/community_1.png"]
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
          images: ["/images/models/community_2.png"]
        },
        {
          title: "Prestige Ring",
          slug: "prestige-ring",
          description: "Elegant modern premium solitaire ring crafted for statement occasions.",
          price: 1999,
          compareAtPrice: null,
          stock: 15,
          featured: true,
          categoryId: rings.id,
          images: ["/images/models/community_3.png"]
        },
        {
          title: "Classic Choker",
          slug: "classic-choker",
          description: "A quietly bold statement choker necklace with hand-threaded accents.",
          price: 8999,
          compareAtPrice: 9999,
          stock: 5,
          featured: true,
          categoryId: necklaces.id,
          images: ["/images/models/community_4.png"]
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
          images: ["/images/models/community_1.png"]
        },
        {
          title: "Serene Cuff Bracelet",
          slug: "serene-cuff-bracelet",
          description: "Minimalist gold cuff bracelet designed for modern luxury looks.",
          price: 2499,
          compareAtPrice: null,
          stock: 10,
          featured: false,
          categoryId: bracelets.id,
          images: ["/images/models/community_4.png"]
        }
      ]
    })

    console.log("Supabase database successfully seeded with live products!")
  } catch (err) {
    console.error("Auto seeding error:", err)
  }
}
