interface HomePageProps {
  params: Promise<{ orgId: string }>;
}
export default async function HomePage({ params }: HomePageProps) {

  return <div className="size-full flex items-center justify-center p-10">Home Page [Under Construction]</div>;
}
