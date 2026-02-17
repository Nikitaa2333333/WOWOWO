import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');

try {
    let data = fs.readFileSync(filePath, 'utf8');

    // Quick fix for JSON errors (trailing commas) functionality from before
    if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);
    data = data.replace(/,\s*([\]}])/g, '$1');

    const products = JSON.parse(data);

    // Ищем все товары, у которых в названии "12" и "15ml"
    const duplicates = products.filter(p => p.name && p.name.includes('12') && p.name.includes('15ml') && p.name.includes('Rotor'));

    console.log(`\nFound ${duplicates.length} entries for "12...15ml Angle Rotor":`);

    // Выводим категории, к которым они привязаны
    const categoriesMap = {};
    duplicates.forEach(p => {
        const sub = p.subcategoryId || 'MISSING';
        if (!categoriesMap[sub]) categoriesMap[sub] = 0;
        categoriesMap[sub]++;
    });

    console.table(categoriesMap);

    if (Object.keys(categoriesMap).length > 2) {
        console.log('\n!!! ALERT: This product is duplicated across many categories! That explains why you see it everywhere.');
    }

} catch (err) {
    console.error('Error:', err.message);
}
