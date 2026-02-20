import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminVariantManager } from '@/components/admin-variant-manager'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AdminVariantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get product
  const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', id).single()

  if (productError || !product) {
    redirect('/admin/products')
  }

  // Check admin status
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Mock variants data (will integrate with DB later)
  const variants = [
    {
      id: 'var-1',
      name: '1.0 Ton Inverter',
      capacity: '1.0 Ton',
      color: '#FFFFFF',
      specifications: { 'energy_rating': '5 Star', 'cooling_capacity': '1.0 Ton' },
      priceMultiplier: 1.0,
      isActive: true,
    },
    {
      id: 'var-2',
      name: '1.5 Ton Inverter',
      capacity: '1.5 Ton',
      color: '#FFFFFF',
      specifications: { 'energy_rating': '5 Star', 'cooling_capacity': '1.5 Ton' },
      priceMultiplier: 1.15,
      isActive: true,
    },
  ]

  // Mock plans data (will integrate with DB later)
  const plans = [
    {
      id: 'plan-1',
      name: 'Monthly',
      durationMonths: 1,
      discountPercentage: 0,
      features: ['Free installation', 'Basic maintenance', '24/7 support'],
      isPopular: false,
      isActive: true,
    },
    {
      id: 'plan-2',
      name: 'Quarterly',
      durationMonths: 3,
      discountPercentage: 10,
      features: ['Free installation', 'Priority maintenance', 'One free relocation', 'Extended warranty'],
      isPopular: true,
      isActive: true,
    },
    {
      id: 'plan-3',
      name: 'Annual',
      durationMonths: 12,
      discountPercentage: 20,
      features: ['Free installation', 'Premium maintenance', 'Unlimited relocations', 'Full warranty'],
      isPopular: false,
      isActive: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />

      <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/admin/products" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Product Variants & Plans</h1>
            <p className="text-muted-foreground">
              Configure product variants and service plans for: <span className="font-semibold">{product.name}</span>
            </p>
          </div>
        </div>

        {/* Admin Manager */}
        <AdminVariantManager
          productId={id}
          variants={variants}
          plans={plans}
          onVariantAdd={(variant) => console.log('Add variant:', variant)}
          onVariantEdit={(id, variant) => console.log('Edit variant:', id, variant)}
          onVariantDelete={(id) => console.log('Delete variant:', id)}
          onPlanAdd={(plan) => console.log('Add plan:', plan)}
          onPlanEdit={(id, plan) => console.log('Edit plan:', id, plan)}
          onPlanDelete={(id) => console.log('Delete plan:', id)}
        />

        {/* Info Section */}
        <div className="mt-12 p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
          <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Database Integration Coming Soon</h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            The variant and plan management system is fully designed and ready for backend integration. Once the database schema is set up, these changes will be persisted automatically.
          </p>
        </div>
      </main>
    </div>
  )
}
