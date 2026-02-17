import fs from 'fs';

const PRODUCTS_FILE = './lib/products_scraped.ts';
const DATA_FILE = './lib/data.ts';

try {
    const productsContent = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const dataContent = fs.readFileSync(DATA_FILE, 'utf8');

    // Находим все ID категорий в data.ts (для всех разделов, не только центрифуг)
    const dataIds = [...dataContent.matchAll(/id:\s*'(.*?)'/g)].map(m => m[1]);

    // Находим все ID, которые реально назначены товарам
    const assignedIds = [...productsContent.matchAll(/"subcategoryId":\s*"(.*?)"/g)].map(m => m[1]);

    const counts = {};
    assignedIds.forEach(id => counts[id] = (counts[id] || 0) + 1);

    console.log('\n📊 СУПЕР-ОТЧЕТ ПО ВСЕМ КАТЕГОРИЯМ (38+):');
    console.log('-------------------------------------------');

    let filledCount = 0;
    let emptyCount = 0;

    dataIds.forEach(id => {
        const count = counts[id] || 0;
        if (count > 0) {
            console.log(`✅ ${id.padEnd(45)} | ${count} шт.`);
            filledCount++;
        } else {
            console.log(`❌ ${id.padEnd(45)} | ПУСТО`);
            emptyCount++;
        }
    });

    console.log('-------------------------------------------');
    console.log(`ИТОГО КАТЕГОРИЙ В DATA.TS: ${dataIds.length}`);
    console.log(`ЗАПОЛНЕНО: ${filledCount}`);
    console.log(`ПУСТЫХ: ${emptyCount}`);
    console.log(`ВСЕГО ТОВАРОВ: ${assignedIds.length}`);

} catch (e) {
    console.log('Ошибка:', e.message);
}
