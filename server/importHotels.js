import { PrismaClient } from './prisma/generated/prisma-client/index.js';
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT_DIRECTORY = path.resolve(__dirname, "../python/hotel_json_cleaned");

// initiate the script to import hotels from json files
async function main() {
    const files = await fs.readdir(INPUT_DIRECTORY);

    for (const file of files) {
        if (!file.endsWith(".json")) {
            continue;
        }
        const data = JSON.parse(await fs.readFile(path.join(INPUT_DIRECTORY, file), "utf-8"));
        // initialize the array of hotel records
        const hotel_record = data.map(item => ({
            city: item.city,
            state: item.state,
            name: item.name,
            rating: item.rating,
            imageUrl: item.image_url,
            reviewCount: item.review_count,
            price: item.price,
            description: item.description,
        }));
        // upsert each hotel record
        for (const record of hotel_record) {
            await prisma.hotel.upsert({
                where: {
                    name_city_state: {
                        name: record.name,
                        city: record.city,
                        state: record.state,
                    }
                },
                // if the hotel doesn't exist, create a new one
                create: record,
                update: {
                    rating: record.rating,
                    imageUrl: record.imageUrl,
                    reviewCount: record.reviewCount,
                    price: record.price,
                    description: record.description,
                }
            });
        }
    }
}
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
