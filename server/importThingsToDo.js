import { PrismaClient } from './prisma/generated/prisma-client/index.js';
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";


const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT_DIRECTORY = path.resolve(__dirname, "../python/things_to_do_json");

async function main() {
    const files = await fs.readdir(INPUT_DIRECTORY);

    for (const file of files) {
        if (!file.endsWith(".json")) {
            continue;
        }
        const data = JSON.parse(await fs.readFile(path.join(INPUT_DIRECTORY, file), "utf-8"));

        const thingsToDo = data.map(item => ({
            city: item.city,
            state: item.state,
            name: item.name,
            rating: item.rating,
            imageUrl: item.image_url,
            reviewCount: item.review_count,
            category: item.category,
            description: item.description,
            location: item.location,
        }));

        for (const record of thingsToDo) {
            await prisma.thingsToDo.upsert({
                where: {
                    name_city_state: {
                        name: record.name,
                        city: record.city,
                        state: record.state,
                    }
                },
                create: record,
                update: {
                    rating: record.rating,
                    imageUrl: record.imageUrl,
                    reviewCount: record.reviewCount,
                    category: record.category,
                    description: record.description,
                    location: record.location,
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
