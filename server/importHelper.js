import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

export const prisma = new PrismaClient();


export function transformItemToRecord(item, extraFields) {
  const record = {
    city:        item.city,
    state:       item.state,
    name:        item.name,
    rating:      item.rating,
    imageUrl:    item.image_url,
    reviewCount: item.review_count,
    description: item.description,
  };

  extraFields.forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, char => `_${char.toLowerCase()}`);
    record[key] = item[snakeKey];
  });
  return record;
}

export async function upsertBatch(modelName, records) {
  await Promise.all(
    records.map(rec => {
      const { name, city, state, ...updates } = rec;
      return prisma[modelName].upsert({
        where: { name_city_state: { name, city, state } },
        create: rec,
        update: updates,
      });
    })
  );
}

export async function importCategory({ model, directory, extraFields }, baseDir) {
  const dirPath = path.resolve(baseDir, directory);
  const files   = (await fs.readdir(dirPath)).filter(f => f.endsWith('.json'));

  // read & parse every file
  let allItems = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(dirPath, file), 'utf-8');
    allItems = allItems.concat(JSON.parse(raw));
  }

  // map & batch‑upsert
  const records = allItems.map(item => transformItemToRecord(item, extraFields));
  for (let i = 0; i < records.length; i += 100) {
    await upsertBatch(model, records.slice(i, i + 100));
  }
}
