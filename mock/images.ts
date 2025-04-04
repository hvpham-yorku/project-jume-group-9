import { PRODUCTS } from "./data";
import { createClient } from "@supabase/supabase-js";
import { handleize } from "@/utils/utils";

import type { Database } from "@/utils/supabase/types/db";

async function main() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  async function getOrCreatePublicBucket() {
    const bucketName = "media";
    let bucket;
    const { data: foundBucket, error: foundError } = await supabase.storage.getBucket(bucketName);
    if (!foundBucket || foundError) {
      console.error("Public bucket not found, so creating public bucket...");
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
      });
      if (!createdBucket || createError) {
        console.error(createError ?? "Error creating public bucket");
        return;
      }
      bucket = createdBucket;
    } else {
      bucket = foundBucket;
    }

    return bucket;
  }

  async function pushPublicProductImagesToSupabaseStorage(products: (typeof PRODUCTS)[string][]) {
    const bucket = await getOrCreatePublicBucket();
    if (!bucket) {
      console.error("Public bucket not found or error creating bucket, so skipping product images");
      return products;
    }

    const uploadPromises = products.map(async (product) => {
      if (!product.publicImage) return null;

      // console.log(`${product.name} - Pushing to supabase storage`);

      try {
        // download the image
        const publicImageFile = await fetch(product.publicImage, { signal: AbortSignal.timeout(5000) }).then((res) =>
          res.blob(),
        );
        // console.log(`${product.name} - Downloaded image`);

        // upload the image to supabase
        const { data, error } = await supabase.storage
          .from(bucket.name)
          .upload(`${handleize(product.name)}.jpg`, publicImageFile, {
            upsert: true,
          });

        if (error || !data) {
          console.error(error ?? "No data");
          throw new Error(error?.message ?? "No data");
        }

        // update the product with the new image url
        product.image = data.path;
        // console.log(`${product.name} - Uploaded image`);

        const { data: publicUrlData } = supabase.storage.from(bucket.name).getPublicUrl(data.path);
        // console.log(`${product.name} - Public URL: ${publicUrlData.publicUrl}`);

        return product;
      } catch (err) {
        console.error(`${product.name} - Error: ${err}`);
        return err;
      }
    });

    const res = await Promise.allSettled(uploadPromises);
    const failedProducts = res.filter((result) => result.status === "rejected").map((result) => result.reason);
    if (failedProducts.length > 0) {
      console.log(`Failed to upload ${failedProducts.length} products`, { failedProducts });
    }

    return products;
  }
  const productsWithImages = await pushPublicProductImagesToSupabaseStorage(Object.values(PRODUCTS));

  console.log(`Done Uploading ${productsWithImages.length} Products Images`);
  process.exit();
}

main();
