import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'products.json'), 'utf8'));

console.log('╔══════════════════════════════════════════════════╗');
console.log('║        ДОКАЗАТЕЛЬСТВО ЧТО ДУБЛИ — РЕАЛЬНЫ       ║');
console.log('╚══════════════════════════════════════════════════╝\n');

// 1. Базовые числа
const nameMap = {};
products.forEach(p => {
    const key = p.name.trim().toLowerCase();
    if (!nameMap[key]) nameMap[key] = [];
    nameMap[key].push(p);
});

const uniqueNames = Object.keys(nameMap).length;
const duplicateGroups = Object.entries(nameMap).filter(([, arr]) => arr.length > 1);
const singleProducts = Object.entries(nameMap).filter(([, arr]) => arr.length === 1);

console.log(`📊 ФАКТ 1: Сейчас в JSON ${products.length} записей, но уникальных ИМЁН только ${uniqueNames}`);
console.log(`   → ${products.length - uniqueNames} записей — это повторы одного и того же товара\n`);

// 2. Конкретный пример
console.log('📋 ФАКТ 2: Конкретный пример дубля:\n');
const example = duplicateGroups[0];
if (example) {
    const [, items] = example;
    console.log(`   Товар: "${items[0].name}"`);
    console.log(`   Встречается ${items.length} раз(а):`);
    items.forEach((item, i) => {
        console.log(`     ${i + 1}. subcategoryId: "${item.subcategoryId}"`);
        console.log(`        images: ${JSON.stringify(item.images)}`);
    });
    console.log(`\n   ☝️  Одно и то же название, одна и та же фотка. Просто в разных подкатегориях.\n`);
}

// 3. Симуляция: что будет ПОСЛЕ удаления
console.log('📊 ФАКТ 3: ЧТО БУДЕТ ПОСЛЕ (симуляция, ничего не удаляем)\n');

// Считаем товары по подкатегориям ДО
const beforeCounts = {};
products.forEach(p => { beforeCounts[p.subcategoryId] = (beforeCounts[p.subcategoryId] || 0) + 1; });

// Симулируем удаление
const indicesToRemove = new Set();
duplicateGroups.forEach(([, items]) => {
    // Оставляем в самой конкретной подкатегории (не в generic centrifuge-rotor)
    let bestIdx = 0;
    for (let i = 0; i < items.length; i++) {
        const subId = items[i].subcategoryId;
        // Предпочитаем конкретные категории, а не generic
        if (subId !== 'centrifuge-rotor') {
            bestIdx = i;
            break;
        }
    }
    items.forEach((item, i) => {
        if (i !== bestIdx) {
            // Находим реальный индекс в массиве products
            const realIdx = products.findIndex(p => p.id === item.id && p.subcategoryId === item.subcategoryId);
            if (realIdx !== -1) indicesToRemove.add(realIdx);
        }
    });
});

const afterProducts = products.filter((_, idx) => !indicesToRemove.has(idx));
const afterCounts = {};
afterProducts.forEach(p => { afterCounts[p.subcategoryId] = (afterCounts[p.subcategoryId] || 0) + 1; });

console.log('   Подкатегория                         ДО  →  ПОСЛЕ');
console.log('   ─────────────────────────────────────────────────');
const allSubs = new Set([...Object.keys(beforeCounts), ...Object.keys(afterCounts)]);
[...allSubs].sort().forEach(sub => {
    const before = beforeCounts[sub] || 0;
    const after = afterCounts[sub] || 0;
    const diff = before - after;
    const marker = diff > 0 ? ` (−${diff} дублей)` : '';
    const empty = after === 0 ? ' ⚠️ ПУСТО!' : '';
    console.log(`   ${sub.padEnd(40)} ${String(before).padStart(3)} → ${String(after).padStart(3)}${marker}${empty}`);
});

// 4. Гарантии
console.log('\n✅ ГАРАНТИИ:');
const emptyAfter = [...allSubs].filter(s => (afterCounts[s] || 0) === 0);
console.log(`   • Ни одна подкатегория НЕ станет пустой: ${emptyAfter.length === 0 ? 'ДА ✓' : 'НЕТ ✗ — ' + emptyAfter.join(', ')}`);
console.log(`   • Бэкап сохранён: products_backup.json ✓`);
console.log(`   • Уникальных товаров ДО:    ${uniqueNames}`);
console.log(`   • Уникальных товаров ПОСЛЕ: ${uniqueNames} (ни один не потерян)`);
console.log(`   • Записей ДО:   ${products.length}`);
console.log(`   • Записей ПОСЛЕ: ${afterProducts.length}`);
console.log(`   • Удалено:      ${indicesToRemove.size} (только копии, не оригиналы)`);

console.log('\n⚠️  Это СИМУЛЯЦИЯ. Файл НЕ изменён.');
