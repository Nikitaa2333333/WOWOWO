import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');

try {
    let data = fs.readFileSync(filePath, 'utf8');

    // Убираем BOM и лишние запятые
    if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);
    data = data.replace(/,\s*([\]}])/g, '$1');

    // Проверка и сохранение
    const products = JSON.parse(data);
    console.log(`Success! File is valid JSON now. Total products: ${products.length}`);

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log('File saved.');

} catch (err) {
    console.error('Error:', err.message);
}
