import { Metadata } from "next";

interface UpdateOrderPageProps {
  params: Promise<{ orgId: string; orderId: string }>;
}

export const metadata: Metadata = {
  title: "Update Order",
  description: "Update order details",
};

export default async function UpdateOrderPage(props: UpdateOrderPageProps) {

  return <div>Update Form</div>;
}
