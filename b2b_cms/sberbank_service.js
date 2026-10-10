/**
 * Backend Sberbank Acquiring Gateway Module
 * Осуществляет защищенное серверное взаимодействие со шлюзом Сбербанка
 */

const https = require('https');
const querystring = require('querystring');

const SBER_CONFIG = {
    isTest: process.env.SBER_TEST_MODE !== 'false', // по умолчанию тестовый режим
    testHost: '3dsec.sberbank.ru',
    prodHost: 'securepayments.sberbank.ru',
    merchants: {
        'rockhitneva': {
            userName: process.env.SBER_USER_ROCKHIT || 'rockhitneva-api',
            password: process.env.SBER_PASSWORD_ROCKHIT || ''
        },
        'aquasound': {
            userName: process.env.SBER_USER_AQUA || 'aquasound-api',
            password: process.env.SBER_PASSWORD_AQUA || ''
        },
        'nevaconcert': {
            userName: process.env.SBER_USER_NEVA || 'nevaconcert-api',
            password: process.env.SBER_PASSWORD_NEVA || ''
        }
    }
};

function sberRequest(endpoint, params) {
    return new Promise((resolve, reject) => {
        const postData = querystring.stringify(params);
        const host = SBER_CONFIG.isTest ? SBER_CONFIG.testHost : SBER_CONFIG.prodHost;

        const options = {
            hostname: host,
            port: 443,
            path: `/payment/rest/${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    resolve({ errorCode: 'PARSE_ERROR', errorMessage: data });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Sberbank API request timeout'));
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Регистрация заказа в Сбербанке (register.do)
 */
async function registerOrder({ orderNumber, amountInRubles, returnUrl, failUrl, description, email, phone, merchantKey = 'rockhitneva' }) {
    const merchant = SBER_CONFIG.merchants[merchantKey] || SBER_CONFIG.merchants['rockhitneva'];
    const amountInKopecks = Math.round(Number(amountInRubles) * 100);

    const params = {
        userName: merchant.userName,
        password: merchant.password,
        orderNumber: String(orderNumber),
        amount: amountInKopecks,
        currency: 643,
        returnUrl: returnUrl,
        failUrl: failUrl,
        description: description || `Заказ #${orderNumber}`
    };

    if (email || phone) {
        params.jsonParams = JSON.stringify({
            email: email || '',
            phone: phone ? phone.replace(/\D/g, '') : ''
        });
    }

    return await sberRequest('register.do', params);
}

/**
 * Проверка статуса заказа (getOrderStatusExtended.do)
 */
async function getOrderStatus(orderId, merchantKey = 'rockhitneva') {
    const merchant = SBER_CONFIG.merchants[merchantKey] || SBER_CONFIG.merchants['rockhitneva'];
    return await sberRequest('getOrderStatusExtended.do', {
        userName: merchant.userName,
        password: merchant.password,
        orderId: orderId
    });
/**
 * Возврат заказа/билета (refund.do)
 */
async function refundOrder({ orderId, amountInRubles, merchantKey = 'rockhitneva' }) {
    const merchant = SBER_CONFIG.merchants[merchantKey] || SBER_CONFIG.merchants['rockhitneva'];
    const params = {
        userName: merchant.userName,
        password: merchant.password,
        orderId: String(orderId)
    };

    if (amountInRubles) {
        params.amount = Math.round(Number(amountInRubles) * 100);
    }

    return await sberRequest('refund.do', params);
}

module.exports = {
    SBER_CONFIG,
    registerOrder,
    getOrderStatus,
    refundOrder
};
