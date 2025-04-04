import { createSeedClient } from "@snaplet/seed";
import { createClient } from "@supabase/supabase-js";
import { CUSTOMERS, ORGS, PRODUCTS, ORDERS } from "./data";

import type { Database } from "@/utils/supabase/types/db";
import { handleize } from "@/utils/utils";

async function main() {
  const seed = await createSeedClient({ dryRun: true });
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  // await seed.$resetDatabase();

  const { data, error } = await supabase.storage.createBucket("media", { public: true });
  if (!data || error) console.error(error);

  await seed.orgs(Object.values(ORGS));
  await seed.customers(Object.values(CUSTOMERS));
  await seed.products(
    Object.values(PRODUCTS).map((product) => ({ ...product, image: `${handleize(product.name)}.jpg` })),
  );
  await seed.orders(Object.values(ORDERS));

  process.exit();
}

main();
