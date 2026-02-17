import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Всего товаров: ${products.length}`);

// Группируем по имени
const byName = {};
products.forEach((p, idx) => {
    const key = p.name.trim().toLowerCase();
    if (!byName[key]) byName[key] = [];
    byName[key].push({ ...p, _index: idx });
});

// Находим дубли
const duplicateNames = Object.entries(byName).filter(([, items]) => items.length > 1);
console.log(`\nТоваров-дублей (по имени): ${duplicateNames.length}`);

// Для каждого дубля — выбираем "лучшую" подкатегорию
// Приоритет: подкатегория, которая содержит ключевые слова из имени товара
const indicesToRemove = new Set();

duplicateNames.forEach(([name, items]) => {
    const categories = items.map(i => i.subcategoryId);
    console.log(`  "${items[0].name}" → в ${items.length} категориях: ${categories.join(', ')}`);

    // Определяем лучшую подкатегорию
    let best = items[0];

    const nameLower = name.toLowerCase();

    // Ищем подкатегорию, которая лучше всего подходит по имени
    for (const item of items) {
        const subId = item.subcategoryId.toLowerCase();

        // Если имя содержит "angle rotor" и подкатегория содержит "rotor" — это лучший матч
        if (nameLower.includes('angle rotor') && subId.includes('centrifuge-rotor')) {
            best = item;
            break;
        }
        if (nameLower.includes('swing rotor') && subId.includes('swing')) {
            best = item;
            break;
        }
        if (nameLower.includes('pcr') && subId.includes('pcr')) {
            best = item;
            break;
        }
        if (nameLower.includes('microplate') && subId.includes('microplate')) {
            best = item;
            break;
        }
        if (nameLower.includes('bottle') && subId.includes('bottle')) {
            best = item;
            break;
        }
        if (nameLower.includes('tube') && subId.includes('tube')) {
            best = item;
            break;
        }
        // Если в subcategoryId есть слова из имени товара
        const subWords = subId.split('-');
        const nameWords = nameLower.split(' ');
        const overlap = subWords.filter(w => w.length > 3 && nameWords.includes(w));
        if (overlap.length > 0) {
            best = item;
        }
    }

    // Удаляем все копии кроме лучшей
    items.forEach(item => {
        if (item._index !== best._index) {
            indicesToRemove.add(item._index);
        }
    });
});

console.log(`\nУдаляем ${indicesToRemove.size} дублей...`);

// Фильтруем
const cleaned = products.filter((_, idx) => !indicesToRemove.has(idx));

fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));
console.log(`✅ Готово! Было: ${products.length}, стало: ${cleaned.length}`);
