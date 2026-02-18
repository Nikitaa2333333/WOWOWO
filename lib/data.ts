import { Category, Subcategory } from '../types';

export const CATEGORIES: Category[] = [
    { id: 'general-lab', name: 'Общелабораторное оборудование', span: '1x1' },
    { id: 'consumables', name: 'Расходные материалы', span: '1x1' },
    { id: 'analytical', name: 'Аналитическое оборудование', span: '1x1' },
    { id: 'thermo', name: 'Термостатическое оборудование', span: '1x1' },
    { id: 'measuring', name: 'Измерительные приборы', span: '1x1' },
    { id: 'centrifuge', name: 'Центрифугирование', span: '1x1' },
    { id: 'distillation', name: 'Дистилляция и фильтрация', span: '1x1' },
    { id: 'pharmaceutical', name: 'Фармацевтическое оборудование', span: '1x1' },
    { id: 'microscopes', name: 'Микроскопия', span: '1x1' },
    { id: 'laminar', name: 'Ламинарные шкафы и боксы', span: '1x1' },
    { id: 'cleaning', name: 'Очистка и стерилизация', span: '1x1' },
    { id: 'furniture', name: 'Лабораторная мебель', span: '1x1' }
];

export const SUBCATEGORIES: Subcategory[] = [
    {
        id: 'blood-bank-centrifuge',
        categoryId: 'centrifuge',
        name: 'Центрифуги для службы крови'
    },
    {
        id: 'high-speed-centrifuge',
        categoryId: 'centrifuge',
        name: 'Высокоскоростные центрифуги'
    },
    {
        id: 'high-speed-refrigerated-centrifuge',
        categoryId: 'centrifuge',
        name: 'Высокоскоростные с охлаждением'
    },
    {
        id: 'large-capacity-refrigerated-centrifuge',
        categoryId: 'centrifuge',
        name: 'Большой емкости с охлаждением'
    },
    {
        id: 'low-speed-centrifuge',
        categoryId: 'centrifuge',
        name: 'Низкоскоростные центрифуги'
    }
];

export const MANUFACTURERS = [
    { id: 'yingtai', name: 'Yingtai Instrument', logo: 'https://cdn.brandfetch.io/yingtai.com/w/400/h/400' },
    { id: 'eppendorf', name: 'Eppendorf', logo: 'https://cdn.brandfetch.io/eppendorf.com/w/400/h/400' },
    { id: 'biobase', name: 'Biobase', logo: 'https://cdn.brandfetch.io/biobase.cc/w/400/h/400' },
    { id: 'thermo-fisher', name: 'Thermo Fisher Scientific', logo: 'https://cdn.brandfetch.io/thermofisher.com/w/400/h/400' },
    { id: 'ika', name: 'IKA', logo: 'https://cdn.brandfetch.io/ika.com/w/400/h/400' },
    { id: 'memmert', name: 'Memmert', logo: 'https://cdn.brandfetch.io/memmert.com/w/400/h/400' },
];
