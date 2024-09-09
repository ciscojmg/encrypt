document.addEventListener('DOMContentLoaded', function () {

    // Función para generar la clave privada
    async function generatePrivateKey() {
        const key = crypto.getRandomValues(new Uint8Array(32)); // 32 bytes de aleatoriedad
        return Array.from(key).map(b => ('00' + b.toString(16)).slice(-2)).join(''); // Convertir a cadena hexadecimal
    }

    // Evento para el botón de generación de clave
    document.getElementById('generateKeyButton').addEventListener('click', async () => {
        const privateKey = await generatePrivateKey();
        document.getElementById('generatedKey').value = privateKey;
    });

    // Función para derivar clave
    function deriveKey(privateKey) {
        return CryptoJS.PBKDF2(privateKey, 'salt', { keySize: 256/32, iterations: 1000 });
    }

    // Función para encriptar con clave privada
    function encryptWithPrivateKey(data, privateKey) {
        const key = deriveKey(privateKey);
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
        return {
            encryptedData: encrypted.toString(),
            iv: CryptoJS.enc.Base64.stringify(iv)
        };
    }

    // Función para desencriptar con clave privada
    function decryptWithPrivateKey(encryptedData, ivBase64, privateKey) {
        const key = deriveKey(privateKey);
        const iv = CryptoJS.enc.Base64.parse(ivBase64);
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    // Evento para el formulario de encriptación
    document.getElementById('encryptForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = document.getElementById('dataToEncrypt').value;
        const privateKey = document.getElementById('encryptKey').value;

        try {
            const result = encryptWithPrivateKey(data, privateKey);
            document.getElementById('encryptResult').textContent = JSON.stringify(result, null, 2);
        } catch (error) {
            document.getElementById('encryptResult').textContent = `Error: ${error.message}`;
        }
    });

    // Evento para el formulario de desencriptación
    document.getElementById('decryptForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const encryptedData = document.getElementById('encryptedData').value;
        const ivBase64 = document.getElementById('ivBase64').value;
        const privateKey = document.getElementById('decryptKey').value;

        try {
            const decryptedResult = decryptWithPrivateKey(encryptedData, ivBase64, privateKey);
            document.getElementById('decryptResult').textContent = decryptedResult;
        } catch (error) {
            document.getElementById('decryptResult').textContent = `Error: ${error.message}`;
        }
    });

});
