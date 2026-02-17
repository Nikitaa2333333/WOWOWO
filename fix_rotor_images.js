import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');

const data = fs.readFileSync(filePath, 'utf8');
const products = JSON.parse(data);

let fixedCount = 0;

products.forEach(p => {
    // Если в названии есть "Rotor" и картинок больше одной
    if (p.name && p.name.includes('Rotor') && p.images && p.images.length > 1) {
        // Оставляем только последнюю картинку (это реальный ротор)
        const lastImage = p.images[p.images.length - 1];
        p.images = [lastImage];
        fixedCount++;
        console.log(`Fixed: ${p.name} -> kept only: ${lastImage}`);
    }
});

fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`\nDone! Fixed ${fixedCount} rotor products.`);
