interface ProductsPageProps {
  params: Promise<{ orgId: string }>;
}
export default async function ProductsPage({ params }: ProductsPageProps) {

  return <div className="size-full flex items-center justify-center p-10">Products Page [Under Construction]</div>;
}
