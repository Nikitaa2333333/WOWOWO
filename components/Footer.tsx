import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/routes';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link to={ROUTES.HOME} className="text-xl font-black text-gray-900 tracking-tight">
                            WAYY
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Профессиональное лабораторное оборудование от ведущих мировых производителей.
                            Комплексное оснащение и сервисное обслуживание.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900">Навигация</h4>
                        <ul className="space-y-2 text-sm text-gray-500 font-medium">
                            <li>
                                <Link to={ROUTES.CATALOG} className="hover:text-blue-600 transition-colors">Каталог</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.MANUFACTURERS} className="hover:text-blue-600 transition-colors">Производители</Link>
                            </li>
                            <li>
                                <button className="hover:text-blue-600 transition-colors">О компании</button>
                            </li>
                            <li>
                                <button className="hover:text-blue-600 transition-colors">Доставка</button>
                            </li>
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900">Контакты</h4>
                        <ul className="space-y-3 text-sm text-gray-500 font-medium">
                            <li>
                                <a href="tel:+79990000000" className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                                    <Phone className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span>+7 (999) 000-00-00</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@graphic-lab.ru" className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span>info@wayy.ru</span>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>Москва, ул. Примерная, 10</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
                    <p>&copy; {currentYear} WAYY. Все права защищены.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-900 transition-colors">Политика конфиденциальности</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Условия использования</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
