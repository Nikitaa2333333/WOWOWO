import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');

try {
    let data = fs.readFileSync(filePath, 'utf8');

    // Исправление ошибки JSON (лишние запятые)
    if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);
    data = data.replace(/,\s*([\]}])/g, '$1');

    let products = JSON.parse(data);
    const originalCount = products.length;

    console.log(`Original product count: ${originalCount}`);

    // Логика дедупликации
    const uniqueProducts = [];
    const productsByName = {};

    // Группируем по имени
    products.forEach(p => {
        const name = p.name ? p.name.trim() : 'UNKNOWN';
        if (!productsByName[name]) {
            productsByName[name] = [];
        }
        productsByName[name].push(p);
    });

    // Выбираем по одному уникальному представителю
    Object.keys(productsByName).forEach(name => {
        const group = productsByName[name];

        if (group.length === 1) {
            // Если дублей нет, берем как есть
            uniqueProducts.push(group[0]);
        } else {
            // Если есть дубликаты, выбираем "лучший" вариант
            // Приоритет: centrifuge-rotor > low-speed > table-top > первый попавшийся
            let best = group.find(p => p.subcategoryId === 'centrifuge-rotor');
            if (!best) best = group.find(p => p.subcategoryId === 'low-speed-centrifuge-rotor');
            if (!best) best = group[0];

            uniqueProducts.push(best);
        }
    });

    console.log(`Unique product count: ${uniqueProducts.length}`);
    console.log(`Removed ${originalCount - uniqueProducts.length} duplicates.`);

    // Записываем обратно в файл
    fs.writeFileSync(filePath, JSON.stringify(uniqueProducts, null, 2));
    console.log('Successfully updated products.json! Syntax errors fixed and duplicates removed.');

} catch (err) {
    console.error('Error:', err.message);
}
