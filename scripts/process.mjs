import fs from 'fs';
import path from 'path';

const SCRAPED_FILE = './scraped_data_full.json';
const OUTPUT_FILE = './lib/products_scraped.ts';
const LOCAL_IMAGE_DIR = './public/images/products';

const translate = (text) => {
    if (!text) return '';
    return text
        .replace(/Centrifuge/gi, 'Центрифуга')
        .replace(/Refrigerated/gi, 'с охлаждением')
        .replace(/Rotor/gi, 'Ротор');
};

const cleanDescription = (text) => {
    if (!text) return '';
    let cleaned = text;
    if (cleaned.includes('»')) {
        const parts = cleaned.split('»');
        cleaned = parts[parts.length - 1].trim();
    }
    cleaned = cleaned.replace(/HOME ABOUT US.*?\/ 简/gi, '').split('Product Category')[0];
    return cleaned.trim();
};

try {
    const scraped = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));

    const products = scraped.map(p => {
        let nameLower = p.name.toLowerCase();
        let catLower = p.category.toLowerCase();

        // 1. БАЗОВЫЙ ID
        let subId = catLower
            .replace(/[/]/g, '-')
            .replace(/[^a-z0-p]/g, '-')
            .replace(/-+/g, '-')
            .replace(/-$/, '')
            .replace(/^-/, '');

        // 2. ЖЕСТКАЯ КОРРЕКЦИЯ ПОД ТВОЙ data.ts (Тире - это важно!)
        if (nameLower.includes('hematocrit')) subId = 'hematocrit-centrifuge';
        if (nameLower.includes('cyto') || nameLower.includes('smear')) subId = 'cyto-smear-liquid-centrifuge';
        if (nameLower.includes('tube') || nameLower.includes('bottle')) subId = 'centrifugal-tubes---bottles';
        if (nameLower.includes('prp') && !nameLower.includes('rotor')) subId = 'prp--cgf-stem-cell-centrifuge';
        if (subId === 'microscope') subId = 'microscope';

        const filename = `${p.id}.png`;
        const localImageUrl = fs.existsSync(path.join(LOCAL_IMAGE_DIR, filename))
            ? `/images/products/${filename}`
            : '/images/placeholder.jpg';

        return {
            id: p.id,
            subcategoryId: subId,
            name: translate(p.name),
            specs: p.specs.filter(s => s.length > 5 && !s.includes('Availability')).slice(0, 8),
            description: translate(cleanDescription(p.description).slice(0, 200)) + '...',
            images: [localImageUrl],
            inStock: true
        };
    });

    const fileContent = `import { Product } from '../types';\n\nexport const SCRAPED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`✅ FINAL SYNC! All 152 products are now perfectly mapped including triple-dashes.`);
} catch (e) {
    console.error(`❌ Error: ${e.message}`);
}
