import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Всего товаров: ${products.length}\n`);

// Группируем по имени
const byName = {};
products.forEach(p => {
    const key = p.name.trim().toLowerCase();
    if (!byName[key]) byName[key] = [];
    byName[key].push(p);
});

// Уникальные товары (не дубли)
const uniqueCount = Object.values(byName).filter(arr => arr.length === 1).length;
const duplicateGroups = Object.entries(byName).filter(([, arr]) => arr.length > 1);

console.log(`Уникальных товаров: ${uniqueCount}`);
console.log(`Товаров-дублей (разные подкатегории): ${duplicateGroups.length} групп\n`);

let totalDuplicateEntries = 0;

duplicateGroups.forEach(([, items]) => {
    const extra = items.length - 1; // сколько копий удалим (оставим 1)
    totalDuplicateEntries += extra;
    console.log(`  "${items[0].name}" — ${items.length} копий в: ${items.map(i => i.subcategoryId).join(', ')}`);
});

console.log(`\n=== ИТОГО ===`);
console.log(`Будет УДАЛЕНО:    ${totalDuplicateEntries} лишних копий`);
console.log(`Будет ОСТАВЛЕНО:  ${products.length - totalDuplicateEntries} товаров`);
console.log(`\n⚠️  Это СУХОЙ ПРОГОН. Ничего не изменено.`);
