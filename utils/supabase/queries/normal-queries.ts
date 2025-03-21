import "server-only";

import { getOrdersQuery, getProductRestockNotificationsQuery, getProductsQuery } from ".";
import { createClient } from "../client/server";


export const getOrders = async ({ orgId }: { orgId: string }) => {
  try {
    const supabase = await createClient();

    const { data, error } = await getOrdersQuery({ supabase, orgId });

    if (error || !data) {
      throw new Error(`Error fetching orders: ${error || "No orders found"}`);
    } 

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
  

export const getProductRestockNotifications = async ({ orgId }: { orgId: string }) => {
  try {
    const supabase = await createClient();

    const { data, error } = await getProductRestockNotificationsQuery({ supabase, orgId });

    if (error || !data) {
      throw new Error(`Error fetching product restock notifications: ${error || "No product restock notifications found"}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export const getProducts = async ({ orgId }: { orgId: string }) => {
  try {
    const supabase = await createClient();

    const { data, error } = await getProductsQuery({ supabase, orgId });

    if (error || !data) {
      throw new Error(`Error fetching products: ${error || "No products found"}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

