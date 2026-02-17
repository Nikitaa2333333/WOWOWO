import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    let productsArray = [];

    if (Array.isArray(json)) {
        console.log('It is already an array.');
        productsArray = json;
    } else {
        console.log('Root is an OBJECT. Searching for array inside...');
        // Ищем ключ, в котором лежит массив
        const keys = Object.keys(json);
        console.log('Keys found:', keys);

        // Обычно это "products", "data" или "items"
        for (const key of keys) {
            if (Array.isArray(json[key])) {
                console.log(`Found array in key: "${key}" with ${json[key].length} items.`);
                productsArray = json[key];
                break;
            }
        }
    }

    if (productsArray.length > 0) {
        // Теперь сохраняем как ЧИСТЫЙ МАССИВ
        fs.writeFileSync(filePath, JSON.stringify(productsArray, null, 2));
        console.log('Success! Saved products as a flat array. Now the site should see them.');
    } else {
        console.error('Could not find any products array in the file.');
    }

} catch (err) {
    console.error('Error:', err.message);
}
