const fs = require('fs');
const path = require('path');

const dataPath = path.resolve('lib/data_backup.ts');
if (!fs.existsSync(dataPath)) {
    console.error('File not found:', dataPath);
    process.exit(1);
}

const rawData = fs.readFileSync(dataPath, 'utf-8');

// Ищем начало и конец массива PRODUCTS
const marker = 'export const PRODUCTS: Product[] = [';
const productStart = rawData.indexOf(marker);

if (productStart === -1) {
    console.error('Массив PRODUCTS не найден в lib/data_backup.ts.');
    process.exit(1);
}

const productEnd = rawData.lastIndexOf('];');
if (productEnd === -1) {
    console.error('Конец массива PRODUCTS не найден');
    process.exit(1);
}

// "Вырезаем" текст массива как строку
const arrayStr = rawData.substring(productStart + marker.length - 1, productEnd + 1);

// Создаем CommonJS модуль
const tempFile = 'temp_products.cjs';
const moduleContent = `module.exports = ${arrayStr};`;

try {
    fs.writeFileSync(tempFile, moduleContent);

    // В CommonJS require сработает без проблем
    const products = require('./' + tempFile);

    console.log(`Найдено ${products.length} товаров.`);

    // Создаем папку, если нет
    const dataDir = path.resolve('public/data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const jsonPath = path.join(dataDir, 'products.json');
    fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
    console.log(`Данные сохранены в ${jsonPath}`);

} catch (error) {
    console.error('Ошибка:', error);
} finally {
    if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
    }
}
