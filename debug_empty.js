import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'public', 'data', 'products.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`File size: ${data.length} bytes`);

    // First 100 chars
    console.log('Start of file:', data.substring(0, 100));

    try {
        const json = JSON.parse(data);
        console.log('JSON Parse: SUCCESS');

        if (Array.isArray(json)) {
            console.log(`It's an ARRAY with ${json.length} items.`);
            if (json.length > 0) {
                console.log('First item:', JSON.stringify(json[0], null, 2));
            } else {
                console.log('The array is EMPTY [] !! That explains why you see no products.');
            }
        } else {
            console.log('It is NOT an array! Type:', typeof json);
            console.log('Keys:', Object.keys(json));
        }

    } catch (e) {
        console.log('JSON Parse: FAILED');
        console.error(e.message);
    }

} catch (err) {
    console.error('File read error:', err.message);
}
