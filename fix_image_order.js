import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let fixed = 0;

products.forEach(p => {
    if (p.images && p.images.length > 1) {
        // Ставим последнюю картинку на первое место
        const last = p.images.pop();
        p.images.unshift(last);
        fixed++;
    }
});

fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`✅ Переставлено: ${fixed} товаров. Последняя картинка теперь первая.`);
