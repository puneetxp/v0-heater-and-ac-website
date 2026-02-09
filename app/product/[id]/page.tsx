import { ProductDetailClient } from '@/components/product-detail-client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="min-h-screen relative z-10 flex flex-col">
      <Header />
      <ProductDetailClient productId={id} />
      <Footer />
    </main>
  )
}
