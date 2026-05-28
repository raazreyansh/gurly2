import { prisma } from './prisma'

export async function autoSeedDatabase() {
  try {
    const categoryCount = await prisma.category.count()
    if (categoryCount > 0) return

    console.log("Seeding live Supabase database with premium collections...")

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
          images: ["/images/models/community_1.png"],
          material: "18k Solid Gold",
          plating: "24k Gold Plated",
          gemstone: "Cubic Zirconia",
          antiTarnish: true,
          waterproof: true,
          hypoallergenic: true,
          handcrafted: true,
          shippingDays: 3
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
          images: ["/images/models/community_2.png"],
          material: "18k Solid Gold",
          plating: "24k Gold Plated",
          gemstone: "Diamond Cut Crystal",
          antiTarnish: true,
          waterproof: true,
          hypoallergenic: true,
          handcrafted: true,
          shippingDays: 3
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
          images: ["/images/models/community_3.png"],
          material: "925 Sterling Silver",
          plating: "18k Gold Plated",
          gemstone: "AAAAA Solitaire Moissanite",
          antiTarnish: true,
          waterproof: true,
          hypoallergenic: true,
          handcrafted: true,
          shippingDays: 4
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
          images: ["/images/models/community_4.png"],
          material: "Brass Base",
          plating: "24k Gold Overlay",
          gemstone: "None",
          antiTarnish: true,
          waterproof: false,
          hypoallergenic: true,
          handcrafted: true,
          shippingDays: 4
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
          images: ["/images/models/community_1.png"],
          material: "Recycled Stainless Steel",
          plating: "18k Gold PVD Plated",
          gemstone: "None",
          antiTarnish: true,
          waterproof: true,
          hypoallergenic: true,
          handcrafted: false,
          shippingDays: 3
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
          images: ["/images/models/community_4.png"],
          material: "Recycled Stainless Steel",
          plating: "18k Gold PVD Plated",
          gemstone: "None",
          antiTarnish: true,
          waterproof: true,
          hypoallergenic: true,
          handcrafted: true,
          shippingDays: 3
        }
      ]
    })

    console.log("Supabase database successfully seeded with dynamic luxury catalog!")
  } catch (err) {
    console.error("Auto seeding error:", err)
  }
}
