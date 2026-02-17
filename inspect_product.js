import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(data);

    console.log(`Total products: ${products.length}`);

    // Ищем конкретно тот товар с "12...15ml"
    const ghost = products.find(p => p.name && p.name.includes('12') && p.name.includes('15ml') && p.name.includes('Rotor'));

    if (ghost) {
        console.log('\n--- FOUND PROBLEM PRODUCT ---');
        console.log('ID:', ghost.id);
        console.log('Name:', ghost.name);
        console.log('SubcategoryID:', `"${ghost.subcategoryId}"`); // В кавычках, чтобы увидеть пробелы
    } else {
        console.log('\n--- Product specific match not found ---');
    }

    // Проверяем товары с пустым или пробельным ID подкатегории (они будут лезть везде)
    const suspicious = products.filter(p => !p.subcategoryId || p.subcategoryId.trim() === '');
    if (suspicious.length > 0) {
        console.log(`\nFound ${suspicious.length} products with EMPTY or MISSING subcategoryId!`);
        console.log('Sample IDs:', suspicious.slice(0, 3).map(p => p.id));
    } else {
        console.log('\nAll products have a subcategoryId.');
    }

} catch (err) {
    console.error('Error reading file:', err);
}
