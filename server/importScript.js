import path from 'path';
import { fileURLToPath } from 'url';
import { importConfigs } from './importConfigs';
import { importCategory, prisma } from './importHelper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_INPUT_DIR = path.resolve(__dirname, '../python');

async function main() {
    for (const config of importConfigs) {
        await importCategory(config, BASE_INPUT_DIR);
    }
}

main()
    .catch(error => {
        console.error('faield import', error);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });
