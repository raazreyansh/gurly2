import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Step 1: Ensure a category exists
    let category = await prisma.category.findFirst()
    
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Earrings',
          slug: 'earrings',
          imageUrl: '/images/models/community_1.png'
        }
      })
    }

    // Step 2: Create a test product
    const slug = `test-gold-jhumka-${Date.now()}`
    const product = await prisma.product.create({
      data: {
        title: 'Test Gold Jhumka',
        slug,
        description: 'Exquisite handcrafted gold jhumka earrings for automated test.',
        price: 3999,
        compareAtPrice: 4999,
        stock: 20,
        featured: true,
        categoryId: category.id,
        media: [{ type: 'image', url: '/images/models/community_1.png' }],
        material: '18k Gold Plated',
        plating: '24k Gold Overlay',
        gemstone: 'None',
        antiTarnish: true,
        waterproof: true,
        hypoallergenic: true,
        handcrafted: true,
        shippingDays: 3,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        categoryId: product.categoryId,
      }
    })
  } catch (err: any) {
    console.error('TEST API ERROR:', err)
    return NextResponse.json({
      success: false,
      error: err.message,
      code: err.code,
    }, { status: 500 })
  }
}
