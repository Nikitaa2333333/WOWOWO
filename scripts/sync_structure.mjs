import fs from 'fs';

const SCRAPED_FILE = './scraped_data_full.json';
const DATA_FILE = './lib/data.ts';

const translateMap = {
    'Blood Bank Centrifuge': 'Центрифуги для банков крови',
    'High Speed Centrifuge': 'Высокоскоростные центрифуги',
    'High Speed Refrigerated Centrifuge': 'Высокоскоростные с охлаждением',
    'Large Capacity Refrigerated Centrifuge': 'Большой емкости с охлаждением',
    'Low Speed Centrifuge': 'Низкоскоростные центрифуги',
    'Low Speed Refrigerated Centrifuge': 'Низкоскоростные с охлаждением',
    'Mini Centrifuge': 'Микроцентрифуги',
    'PRP/CGF/Stem Cell Centrifuge': 'PRP / CGF / Стволовые клетки',
    'PRP CGF Stem Cell Centrifuge': 'PRP / CGF / Стволовые клетки',
    'Gel Card Centrifuge/Incubator': 'Гель-карты: Центрифуги/Инкубаторы',
    'Cell Washer Centrifuge': 'Центрифуги для мойки клеток',
    'Cyto Smear Liquid Centrifuge': 'Цитологические центрифуги',
    'Hematocrit Centrifuge': 'Гематокритные центрифуги',
    'Oil Test Centrifuge': 'Центрифуги для нефтепродуктов',
    'Incubator': 'Инкубаторы',
    'Centrifugal Tubes & Bottles': 'Пробирки и бутыли',
    'Vacuum Freezer Dryer/ Lyophilizer': 'Лиофильные сушилки',
    'Autoclave': 'Автоклавы',
    'Centrifuge Rotor': 'Роторы',
    'Microscope': 'Микроскопы',
    'Tube Sealer': 'Запайщики трубок',
    'Vacuum Centrifugal Concentrator': 'Вакуумные концентраторы',
    'Floor-Standing Centrifuge': 'Напольные центрифуги',
    'PRP Centrifuge': 'PRP Центрифуги',
    'Refrigerated Centrifuge': 'Центрифуги с охлаждением'
};

try {
    const scraped = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));

    // Собираем уникальные категории из базы
    const uniqueCats = [...new Set(scraped.map(p => p.category))];

    const subcategories = uniqueCats.map(cat => {
        const id = cat.toLowerCase()
            .replace(/[/]/g, '-')
            .replace(/[^a-z0-p]/g, '-')
            .replace(/-+/g, '-')
            .replace(/-$/, '')
            .replace(/^-/, '');

        return {
            id: id,
            categoryId: 'centrifuge',
            name: translateMap[cat] || cat
        };
    });

    const fileContent = `
import { Category, Subcategory } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'centrifuge',
    name: 'Центрифугирование',
    description: 'Профессиональные центрифуги и аксессуары Yingtai Instrument',
    icon: 'Activity'
  }
];

export const SUBCATEGORIES: Subcategory[] = ${JSON.stringify(subcategories, null, 2)};
`;

    fs.writeFileSync(DATA_FILE, fileContent);
    console.log(`✅ lib/data.ts rebuild! Created ${subcategories.length} REAL categories.`);

} catch (e) {
    console.error(`❌ Error: ${e.message}`);
}
