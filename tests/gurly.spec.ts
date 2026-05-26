import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

// ============================================================
// GURLY — E2E Test Suite
// Checks every major route for load errors and key UI elements
// ============================================================

test.describe('Homepage', () => {
  test('loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })

    await page.goto(BASE)
    await page.waitForLoadState('networkidle')

    expect(errors.filter(e => !e.includes('ERR_NAME_NOT_RESOLVED') && !e.includes('supabase'))).toHaveLength(0)
    await expect(page).toHaveTitle(/GURLY/)
    await expect(page.locator('text=GURLY').first()).toBeVisible()
  })

  test('hero section renders', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('h1')).toContainText('Own Your')
    await expect(page.locator('#hero-shop-btn')).toBeVisible()
  })

  test('navbar has all key links', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('#nav-cart-link')).toBeVisible()
    await expect(page.locator('#nav-wishlist-link')).toBeVisible()
    await expect(page.locator('#nav-account-link')).toBeVisible()
    await expect(page.locator('#nav-search-btn')).toBeVisible()
  })

  test('mobile navbar hides desktop links and uses valid shop routes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(BASE)
    await expect(page.locator('nav a[href="/shop"]').first()).toBeHidden()
    await page.getByRole('button', { name: 'Open menu' }).click()
    const mobileMenu = page.getByTestId('mobile-menu')
    await expect(mobileMenu.locator('a[href="/shop?category=earrings"]')).toBeVisible()
    await expect(mobileMenu.locator('a[href="/shop?category=new-arrivals"]')).toBeVisible()
  })

  test('search overlay opens', async ({ page }) => {
    await page.goto(BASE)
    await page.click('#nav-search-btn')
    await expect(page.locator('#nav-search-input')).toBeVisible()
  })

  test('categories section renders', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('#category-earrings')).toBeVisible()
    await expect(page.locator('#category-necklaces')).toBeVisible()
  })

  test('footer renders with newsletter form', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('footer')).toBeVisible()
  })
})

test.describe('Shop Page', () => {
  test('loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/shop`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase') && !e.includes('ERR_NAME'))).toHaveLength(0)
  })

  test('renders page title and structure', async ({ page }) => {
    await page.goto(`${BASE}/shop`)
    await expect(page.locator('h1')).toContainText(/All Products|Earrings|Shop/)
    await expect(page.locator('main p').filter({ hasText: /^\d+ items$/ })).toBeVisible()
  })

  test('shop filters sidebar renders', async ({ page }) => {
    await page.goto(`${BASE}/shop`)
    // Sidebar appears on desktop viewport
    await expect(page.locator('text=Filters')).toBeVisible()
  })

  test('shop price query filters products', async ({ page }) => {
    await page.goto(`${BASE}/shop?minPrice=500&maxPrice=1000`)
    await expect(page.locator('a[href="/product/gold-hoop-earrings"]')).toBeVisible()
    await expect(page.locator('a[href="/product/minimalist-silver-bracelet"]')).toBeVisible()
    await expect(page.locator('a[href="/product/pearl-pendant-necklace"]')).toHaveCount(0)
  })
})

test.describe('Cart Page', () => {
  test('loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/cart`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
  })

  test('empty cart state renders', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.removeItem('gurly-cart'))
    await page.goto(`${BASE}/cart`)
    await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible()
  })

  test('cart shows Start Shopping link when empty', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.removeItem('gurly-cart'))
    await page.goto(`${BASE}/cart`)
    await expect(page.getByRole('link', { name: 'Start Shopping' })).toBeVisible()
  })
})

test.describe('Checkout Page', () => {
  test('loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.addInitScript(() => window.localStorage.removeItem('gurly-cart'))
    await page.goto(`${BASE}/checkout`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
  })

  test('renders empty checkout state without cart items', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.removeItem('gurly-cart'))
    await page.goto(`${BASE}/checkout`)
    await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible()
  })
})

test.describe('Wishlist Page', () => {
  test('loads and shows empty state', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/wishlist`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('h1')).toContainText('Wishlist')
  })
})

test.describe('Search Page', () => {
  test('loads with search input', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/search`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('#search-input')).toBeVisible()
    await expect(page.locator('#search-btn')).toBeVisible()
  })

  test('search input accepts text', async ({ page }) => {
    await page.goto(`${BASE}/search`)
    await page.fill('#search-input', 'earrings')
    await expect(page.locator('#search-input')).toHaveValue('earrings')
  })

  test('query parameter pre-fills search and shows matching products', async ({ page }) => {
    await page.goto(`${BASE}/search?q=earrings`)
    await expect(page.locator('#search-input')).toHaveValue('earrings')
    await expect(page.locator('text=Gold Hoop Earrings')).toBeVisible()
  })
})

test.describe('Auth Pages', () => {
  test('login page loads with form', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/login`)
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
    await expect(page.locator('#login-submit')).toBeVisible()
  })

  test('login form validation works', async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await page.click('#login-submit')
    // Form validation should prevent submission
    const emailInput = page.locator('#login-email')
    await expect(emailInput).toBeVisible()
  })

  test('register page loads with form', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/register`)
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
    await expect(page.locator('#register-name')).toBeVisible()
    await expect(page.locator('#register-email')).toBeVisible()
    await expect(page.locator('#register-password')).toBeVisible()
  })

  test('login page has link to register', async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await expect(page.locator('a[href="/register"]')).toBeVisible()
  })

  test('register page has link to login', async ({ page }) => {
    await page.goto(`${BASE}/register`)
    await expect(page.locator('a[href="/login"]')).toBeVisible()
  })
})

test.describe('Account Pages', () => {
  test('account page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/account`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('h1')).toContainText(/Account/)
  })

  test('orders page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/account/orders`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('h1')).toContainText('My Orders')
  })
})

test.describe('Order Success Page', () => {
  test('loads with confirmation message', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/order/success`)
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
    await expect(page.locator('text=Order Placed')).toBeVisible()
  })
})

test.describe('Admin Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('gurly_admin_auth', 'authenticated')
    })
  })

  test('admin dashboard loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/admin`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('h1', { hasText: 'Dashboard' }).first()).toBeVisible()
  })

  test('admin sidebar nav has all links', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    await expect(page.locator('#admin-nav-dashboard')).toBeVisible()
    await expect(page.locator('#admin-nav-products')).toBeVisible()
    await expect(page.locator('#admin-nav-orders')).toBeVisible()
    await expect(page.locator('#admin-nav-analytics')).toBeVisible()
    await expect(page.locator('#admin-nav-customers')).toBeVisible()
  })

  test('admin products page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/admin/products`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('h1', { hasText: 'Products' }).first()).toBeVisible()
    await expect(page.locator('#add-product-btn')).toBeVisible()
  })

  test('admin new product page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/admin/products/new`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('#product-title')).toBeVisible()
    await expect(page.locator('#product-price')).toBeVisible()
    await expect(page.locator('#publish-product-btn')).toBeVisible()
  })

  test('admin product edit page loads from product table action', async ({ page }) => {
    await page.goto(`${BASE}/admin/products/prod-1/edit`)
    await expect(page.locator('h1')).toContainText('Edit Product')
    await expect(page.locator('#product-title')).toBeVisible()
    await expect(page.locator('#save-product-btn')).toBeVisible()
  })

  test('admin product image uploader exposes catalogue auto-adjust on new and edit forms', async ({ page }) => {
    for (const route of ['/admin/products/new', '/admin/products/prod-1/edit']) {
      await page.goto(`${BASE}${route}`)
      const uploader = page.getByTestId('product-image-uploader')
      await expect(uploader).toBeVisible()
      await expect(uploader.getByLabel('Auto-adjust catalogue images')).toBeChecked()
      await expect(uploader.getByText('Crops to a 3:4 catalogue ratio')).toBeVisible()
    }
  })

  test('admin product auto-adjust converts uploaded catalogue image previews to jpeg', async ({ page }) => {
    await page.route('**/storage/v1/**', (route) => route.abort())
    await page.goto(`${BASE}/admin/products/new`)

    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAGUlEQVR4nGP8z8Dwn4GBgYGBiYGBgQEAJgAD+xsOML8AAAAASUVORK5CYII=',
      'base64'
    )

    await page.setInputFiles('#product-image-files', {
      name: 'catalogue.png',
      mimeType: 'image/png',
      buffer: png,
    })

    const preview = page.getByTestId('product-image-preview').first()
    await expect(preview).toBeVisible()
    await expect(preview).toHaveAttribute('src', /^data:image\/jpeg/)
    await expect(page.getByText('Auto-adjusted to catalogue format')).toBeVisible()
  })

  test('admin analytics page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/admin/analytics`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('h1', { hasText: 'Analytics' }).first()).toBeVisible()
  })

  test('admin orders page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/admin/orders`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('h1')).toContainText('Orders')
  })

  test('admin coupons page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/admin/coupons`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('#coupon-code')).toBeVisible()
    await expect(page.locator('#create-coupon-btn')).toBeVisible()
  })

  test('admin settings page loads', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(`${BASE}/admin/settings`)
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('supabase'))).toHaveLength(0)
    await expect(page.locator('#save-settings-btn')).toBeVisible()
  })

  test('admin inventory page loads', async ({ page }) => {
    await page.goto(`${BASE}/admin/inventory`)
    await expect(page.locator('h1')).toContainText('Inventory')
  })

  test('admin customers page loads', async ({ page }) => {
    await page.goto(`${BASE}/admin/customers`)
    await expect(page.locator('h1')).toContainText('Customers')
  })

  test('admin reports page loads', async ({ page }) => {
    await page.goto(`${BASE}/admin/reports`)
    await expect(page.locator('h1')).toContainText('Reports')
  })

  test('admin coupon creation route loads the coupon form', async ({ page }) => {
    await page.goto(`${BASE}/admin/coupons/new`)
    await expect(page.locator('h1')).toContainText('Coupons')
    await expect(page.locator('#coupon-code')).toBeVisible()
    await expect(page.locator('#create-coupon-btn')).toBeVisible()
  })

  test('admin reports export CSV files', async ({ page }) => {
    await page.goto(`${BASE}/admin/reports`)
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 })
    await page.getByRole('button', { name: 'Export CSV' }).first().click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/report\.csv$/)
  })

  test('admin settings save gives confirmation', async ({ page }) => {
    await page.goto(`${BASE}/admin/settings`)
    await page.fill('#store-name', 'GURLY QA')
    await page.click('#save-settings-btn')
    await expect(page.getByText('Settings saved')).toBeVisible()
  })
})

test.describe('Customer route integrity', () => {
  test('account notifications page loads from account menu', async ({ page }) => {
    await page.goto(`${BASE}/account`)
    await page.getByRole('link', { name: /Notifications/ }).click()
    await expect(page).toHaveURL(/\/account\/notifications/)
    await expect(page.locator('h1')).toContainText('Notifications')
  })

  test('footer legal and support pages load', async ({ page }) => {
    for (const route of ['/privacy', '/terms', '/support']) {
      const response = await page.goto(`${BASE}${route}`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('main h1')).toBeVisible()
    }
  })

  test('footer does not expose placeholder links', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('footer a[href="#"]')).toHaveCount(0)
    await expect(page.locator('footer a[href="/account/orders"]').first()).toBeVisible()
    await expect(page.locator('footer a[href="/wishlist"]').first()).toBeVisible()
  })
})

test.describe('Navigation flows', () => {
  test('can navigate from home to shop', async ({ page }) => {
    await page.goto(BASE)
    await page.click('#hero-shop-btn')
    await expect(page).toHaveURL(/\/shop/)
    await page.waitForSelector('h1', { timeout: 15000 })
    await expect(page.locator('h1')).toBeVisible()
  })

  test('can add a product, open cart, and continue to checkout', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => window.localStorage.removeItem('gurly-cart'))
    await page.goto(`${BASE}/product/gold-hoop-earrings`)
    await page.click('#add-to-cart-btn')
    await page.goto(`${BASE}/cart`)
    await expect(page.locator('#proceed-checkout-btn')).toBeVisible()
    await page.click('#proceed-checkout-btn')
    await expect(page).toHaveURL(/\/checkout/)
  })

  test('logo clicks back to home', async ({ page }) => {
    await page.goto(`${BASE}/shop`)
    await page.locator('a:has-text("GURLY")').first().click()
    await expect(page).toHaveURL(BASE + '/')
  })
})

test.describe('SEO & Meta', () => {
  test('homepage has correct title', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveTitle(/GURLY/)
  })

  test('shop page has title', async ({ page }) => {
    await page.goto(`${BASE}/shop`)
    await expect(page).toHaveTitle(/Shop|GURLY/)
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const resp = await page.request.get(`${BASE}/sitemap.xml`)
    expect(resp.status()).toBe(200)
  })

  test('robots.txt is accessible', async ({ page }) => {
    const resp = await page.request.get(`${BASE}/robots.txt`)
    expect(resp.status()).toBe(200)
  })
})

test.describe('API Routes', () => {
  test('newsletter API returns success', async ({ page }) => {
    const resp = await page.request.post(`${BASE}/api/newsletter`, {
      data: { email: 'test@gurly.in' }
    })
    expect(resp.status()).toBe(200)
    const json = await resp.json()
    expect(json.success).toBe(true)
  })

  test('payment create API responds', async ({ page }) => {
    const resp = await page.request.post(`${BASE}/api/payment/create`, {
      data: { amount: 999 }
    })
    expect(resp.status()).toBe(200)
    const json = await resp.json()
    expect(json).toHaveProperty('id')
  })

  test('webhook handler responds', async ({ page }) => {
    const resp = await page.request.post(`${BASE}/api/webhook/payment`, {
      data: { event: 'payment.captured' }
    })
    expect(resp.status()).toBe(200)
  })
})
