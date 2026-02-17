import { supabase } from './supabase';

interface FormData {
    name: string;
    phone: string;
    productName?: string;
}

export const submitLead = async (data: FormData) => {
    console.log('🚀 Начинаем отправку формы...', data);

    let dbSuccess = false;
    let tgSuccess = false;

    // 1. Сохранение в Supabase
    try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith('eyJ')) {
            console.log('📡 Попытка записи в Supabase...');
            const { error: dbError, data: dbData } = await supabase
                .from('leads')
                .insert([
                    {
                        name: data.name,
                        phone: data.phone,
                        product_name: data.productName
                    }
                ])
                .select();

            if (dbError) {
                console.error('❌ Ошибка Supabase:', dbError.message, dbError.details);
                throw dbError;
            }

            console.log('✅ Данные успешно записаны в таблицу!', dbData);
            dbSuccess = true;
        } else {
            console.warn('⚠️ Проверьте VITE_SUPABASE_ANON_KEY в .env.local. Он должен начинаться на "eyJ"');
        }
    } catch (error) {
        console.error('🚫 Критическая ошибка DB:', error);
    }

    // 2. Отправка в Telegram
    try {
        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            console.log('📱 Отправка уведомления в Telegram...');
            const message = `
🔔 *Новая заявка!*
👤 *Имя:* ${data.name}
📞 *Телефон:* ${data.phone}
📦 *Товар:* ${data.productName || 'Общая заявка'}
📅 *Дата:* ${new Date().toLocaleString('ru-RU')}
      `;

            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            });

            if (response.ok) {
                console.log('✅ Сообщение в Telegram отправлено!');
                tgSuccess = true;
            } else {
                const errData = await response.json();
                console.error('❌ Ошибка Telegram API:', errData);
            }
        }
    } catch (error) {
        console.error('🚫 Ошибка сети при отправке в TG:', error);
    }

    return { success: dbSuccess || tgSuccess };
};
