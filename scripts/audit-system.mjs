import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8')
}

function exists(file) {
  return fs.existsSync(path.join(root, file))
}

const checks = []

function check(name, pass, detail = '') {
  checks.push({ name, pass: Boolean(pass), detail })
}

function contains(file, pattern) {
  return pattern.test(read(file))
}

function listRuntimeFiles(dir) {
  const absoluteDir = path.join(root, dir)
  if (!fs.existsSync(absoluteDir)) return []

  return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listRuntimeFiles(relativePath)
    return /\.(ts|tsx|js|jsx)$/.test(entry.name) ? [relativePath] : []
  })
}

check('Next 16 proxy exists', exists('proxy.ts'))
check('Proxy matches admin routes', contains('proxy.ts', /\/admin\/:path\*/))
check('Proxy redirects anonymous admin users', contains('proxy.ts', /loginUrl\.searchParams\.set\("next"/))
check(
  'Admin layout blocks non-admin users server-side',
  contains('app/admin/layout.tsx', /getCurrentUser\(\)/) &&
    contains('app/admin/layout.tsx', /user\.role !== 'admin'/),
)
check('Product admin actions require admin auth', contains('app/admin/products/actions.ts', /assertAdminUser\(\)/))
check('Category admin actions require admin auth', contains('app/admin/categories/actions.ts', /assertAdminUser\(\)/))
check('Order admin actions require admin auth', contains('app/admin/orders/actions.ts', /assertAdminUser\(\)/))
check('Admin bootstrap requires secret', contains('app/api/admin/bootstrap/route.ts', /ADMIN_BOOTSTRAP_SECRET/))
check('Order API requires customer auth', contains('app/api/orders/route.ts', /getCurrentUser\(\)/))
check('Payment create API requires customer auth', contains('app/api/payment/create/route.ts', /getCurrentUser\(\)/))
check('Payment verify API requires customer auth', contains('app/api/payment/verify/route.ts', /getCurrentUser\(\)/))
check('Checkout page redirects anonymous users', contains('app/checkout/page.tsx', /redirect\('\/login\?next=\/checkout'\)/))
check('Google auth has provider preflight', exists('app/api/auth/google-status/route.ts'))
check('Google button uses provider preflight', contains('components/auth/GoogleAuthButton.tsx', /\/api\/auth\/google-status/))
check('Session cookie is HTTP-only', contains('lib/auth.ts', /httpOnly:\s*true/))
check('Session cookie is secure in production', contains('lib/auth.ts', /secure:\s*process\.env\.NODE_ENV === 'production'/))
check('Session lookup is request memoized', contains('lib/auth.ts', /cache\(async \(token\?: string\)/))
check('Prisma client limits serverless DB connections', contains('lib/prisma.ts', /connection_limit/))
check('Admin dashboard batches DB reads in one transaction', contains('app/admin/page.tsx', /prisma\.\$transaction\(/))
check('Admin dashboard avoids full user include', contains('app/admin/page.tsx', /user:\s*{\s*select:\s*{\s*fullName:\s*true/s))
check('Admin dashboard has database error UI', contains('app/admin/page.tsx', /Analytics Unavailable/))
check('Admin orders page is bounded', contains('app/admin/orders/page.tsx', /take:\s*50/))
check('No localhost references in app runtime code', !/(localhost|127\.0\.0\.1)/.test(
  ['app', 'components', 'lib', 'store']
    .flatMap(listRuntimeFiles)
    .map((file) => read(file))
    .join('\n')
))

const failed = checks.filter((item) => !item.pass)

for (const item of checks) {
  console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name}${item.detail ? ` - ${item.detail}` : ''}`)
}

if (failed.length > 0) {
  console.error(`\nArchitecture audit failed: ${failed.length} issue(s).`)
  process.exit(1)
}

console.log('\nArchitecture audit passed.')
