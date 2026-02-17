import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Читаем products.json
const productsPath = path.join(__dirname, 'public', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// 2. Сканируем public/images/products/ — все правильные фотки
const imagesDir = path.join(__dirname, 'public', 'images', 'products');
const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.webp') || f.endsWith('.png'));

console.log(`Товаров в products.json: ${products.length}`);
console.log(`Фоток в images/products: ${imageFiles.length}`);

// 3. Нормализуем имя файла для сравнения
// Файл: "CDL7M-10-inch-Screen-12pcs-Blood-Bag-Refrigerated-Centrifuge-with-CE-ISO-FDA-pd541545648.webp"
// Товар name: "CDL7M 10-inch Screen 12pcs Blood Bag Refrigerated Centrifuge with CE&ISO FDA"

function normalizeForMatch(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')  // все нелатинские → пробел
        .replace(/\s+/g, ' ')         // схлопываем пробелы
        .trim();
}

// Создаём индекс фоток: нормализованный ключ → filename
const imageIndex = imageFiles.map(f => {
    // Убираем расширение и pd-суффикс для лучшего матчинга
    const nameWithoutExt = f.replace(/\.(webp|png)$/, '');
    const nameWithoutPd = nameWithoutExt.replace(/-pd\d+$/, '');
    return {
        filename: f,
        normalized: normalizeForMatch(nameWithoutPd),
        normalizedFull: normalizeForMatch(nameWithoutExt)
    };
});

let matched = 0;
let unmatched = 0;
let placeholderKept = 0;

products.forEach(product => {
    const productNorm = normalizeForMatch(product.name);

    // Стратегия 1: Точное совпадение нормализованного имени
    let bestMatch = null;
    let bestScore = 0;

    for (const img of imageIndex) {
        // Считаем слова из названия товара, которые есть в имени файла
        const productWords = productNorm.split(' ').filter(w => w.length > 2);
        const matchingWords = productWords.filter(w => img.normalized.includes(w));
        const score = matchingWords.length / productWords.length;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = img;
        }
    }

    // Принимаем матч только если совпадение > 70%
    if (bestMatch && bestScore >= 0.7) {
        product.images = [`/images/products/${bestMatch.filename}`];
        matched++;
    } else {
        // Если не нашли совпадение, оставляем ПОСЛЕДНЮЮ картинку (она обычно самая правильная)
        // Или placeholder если ничего нет
        if (product.images && product.images.length > 1) {
            product.images = [product.images[product.images.length - 1]];
        }
        unmatched++;
        console.log(`  ❌ Не нашёл фотку для: ${product.name} (best score: ${(bestScore * 100).toFixed(0)}%)`);
    }
});

// 4. Сохраняем
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log(`\n✅ Готово!`);
console.log(`   Совпало: ${matched}`);
console.log(`   Без совпадения: ${unmatched}`);
