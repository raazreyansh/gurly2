import { saveServerProduct } from "../services/server-catalog"

async function run() {
  const testProduct = {
    title: "Test YouBella Jewellery Bracelets",
    slug: "test-youbella-jewellery-bracelets-" + Date.now(),
    description: "Test description",
    price: 500,
    compare_at_price: 1199,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400"],
    featured: true,
  }

  console.log("Saving locally...")
  try {
    const data = await saveServerProduct(testProduct)
    console.log("SUCCESS! Saved data:", data)
  } catch (e) {
    console.error("FAIL! Error is:", e)
  }
}

run()
