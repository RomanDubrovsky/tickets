/**
 * Модуль интеграции с интернет-эквайрингом ПАО «Сбербанк»
 * Документация Сбербанк REST API:
 * https://securepayments.sberbank.ru/wiki/doku.php/integration:api:rest:start
 */

// Эндпоинты Сбербанка:
// Тестовая среда (Sandbox): https://3dsec.sberbank.ru/payment/rest/
// Боевая среда (Production): https://securepayments.sberbank.ru/payment/rest/

export const SBERBANK_CONFIG = {
  isTestMode: true, // переключается на false при переходе в боевой режим
  testApiUrl: 'https://3dsec.sberbank.ru/payment/rest',
  prodApiUrl: 'https://securepayments.sberbank.ru/payment/rest',
  
  // Учетные данные для разных юрлиц (заполняются после выдачи Сбером)
  merchants: {
    'rockhitneva': {
      userName: 'rockhitneva-api',
      password: '', // пароль API из личного кабинета Сбера
      token: '',
      currency: 643 // Рубли РФ (ISO-4217)
    },
    'aquasound': {
      userName: 'aquasound-api',
      password: '',
      token: '',
      currency: 643
    },
    'nevaconcert': {
      userName: 'nevaconcert-api',
      password: '',
      token: '',
      currency: 643
    }
  }
};

/**
 * Получить базовый URL шлюза в зависимости от режима
 */
export function getSberApiBaseUrl(isTest = SBERBANK_CONFIG.isTestMode) {
  return isTest ? SBERBANK_CONFIG.testApiUrl : SBERBANK_CONFIG.prodApiUrl;
}

/**
 * 1. Регистрация заказа в платежном шлюзе Сбербанка (register.do)
 * @param {Object} orderData Данные заказа
 * @returns {Promise<{success: boolean, orderId?: string, formUrl?: string, errorMessage?: string}>}
 */
export async function registerSberbankOrder({
  orderNumber,
  amountInRubles,
  description,
  customerEmail,
  customerPhone,
  returnUrl,
  failUrl,
  merchantKey = 'rockhitneva',
  customCredentials = null
}) {
  const isTest = SBERBANK_CONFIG.isTestMode;
  const baseUrl = getSberApiBaseUrl(isTest);
  const merchant = customCredentials || SBERBANK_CONFIG.merchants[merchantKey] || SBERBANK_CONFIG.merchants['rockhitneva'];

  // Сумма в Сбере передается в минимальных единицах валюты (копейках)
  const amountInKopecks = Math.round(Number(amountInRubles) * 100);

  // Формируем параметры запроса
  const params = new URLSearchParams();
  if (merchant.token) {
    params.append('token', merchant.token);
  } else {
    params.append('userName', merchant.userName);
    params.append('password', merchant.password);
  }

  params.append('orderNumber', String(orderNumber));
  params.append('amount', String(amountInKopecks));
  params.append('currency', String(merchant.currency || 643));
  params.append('returnUrl', returnUrl || `${window.location.origin}/#payment-success?orderId=${orderNumber}`);
  params.append('failUrl', failUrl || `${window.location.origin}/#payment-fail?orderId=${orderNumber}`);
  params.append('description', description || `Билеты на рейс (Заказ #${orderNumber})`);

  // Передача данных плательщика для фискального чека (54-ФЗ)
  if (customerEmail || customerPhone) {
    const jsonParams = {};
    if (customerEmail) jsonParams.email = customerEmail;
    if (customerPhone) jsonParams.phone = customerPhone.replace(/\D/g, '');
    params.append('jsonParams', JSON.stringify(jsonParams));
  }

  // Если пароль еще не задан (до получения боевых ключей от банка),
  // предоставляем прозрачную симуляцию шлюза для тестирования процесса чекаута
  if (!merchant.password && !merchant.token) {
    console.info('[Sberbank Module]: API credentials are empty. Simulating payment gateway response.');
    return {
      success: true,
      simulated: true,
      orderId: `sber-sim-${Date.now()}`,
      formUrl: `${window.location.origin}/#payment-mock?orderNumber=${orderNumber}&amount=${amountInRubles}`
    };
  }

  try {
    const response = await fetch(`${baseUrl}/register.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    // В ответе Сбер возвращает:
    // { orderId: "...", formUrl: "https://securepayments.sberbank.ru/payment/doc/open.action?mdOrder=..." }
    // Либо код ошибки: { errorCode: "...", errorMessage: "..." }
    if (data.formUrl) {
      return {
        success: true,
        orderId: data.orderId,
        formUrl: data.formUrl
      };
    } else {
      return {
        success: false,
        errorCode: data.errorCode,
        errorMessage: data.errorMessage || 'Ошибка регистрации заказа в Сбербанке'
      };
    }
  } catch (error) {
    console.error('[Sberbank Module Error]:', error);
    return {
      success: false,
      errorMessage: error.message || 'Сетевая ошибка при обращении к шлюзу Сбербанка'
    };
  }
}

/**
 * 2. Проверка статуса оплаты заказа (getOrderStatusExtended.do)
 * @param {string} orderId Уникальный ID заказа в Сбербанке (mdOrder)
 * @param {string} merchantKey
 */
export async function getSberbankOrderStatus(orderId, merchantKey = 'rockhitneva') {
  const isTest = SBERBANK_CONFIG.isTestMode;
  const baseUrl = getSberApiBaseUrl(isTest);
  const merchant = SBERBANK_CONFIG.merchants[merchantKey] || SBERBANK_CONFIG.merchants['rockhitneva'];

  const params = new URLSearchParams();
  if (merchant.token) {
    params.append('token', merchant.token);
  } else {
    params.append('userName', merchant.userName);
    params.append('password', merchant.password);
  }
  params.append('orderId', orderId);

  try {
    const response = await fetch(`${baseUrl}/getOrderStatusExtended.do?${params.toString()}`);
    const data = await response.json();

    // orderStatus:
    // 0 - заказ зарегистрирован, но не оплачен
    // 1 - предавторизованная сумма удержана
    // 2 - проведена полная авторизация суммы (успешно оплачен)
    // 3 - авторизация отменена
    // 4 - по транзакции была проведена операция возврата
    // 5 - инициирована авторизация через ACS банка-эмитента
    // 6 - авторизация отклонена
    const isPaid = data.orderStatus === 2;

    return {
      success: true,
      orderStatus: data.orderStatus,
      isPaid,
      actionCodeDescription: data.actionCodeDescription || '',
      pan: data.cardAuthInfo?.pan || '',
      paymentSystem: data.cardAuthInfo?.paymentSystem || '',
      raw: data
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: error.message
    };
  }
}

/**
 * 3. Перенаправление покупателя на страницу оплаты Сбербанка
 * @param {string} formUrl Ссылка, выданная методом register.do
 */
export function redirectToSberbankPayment(formUrl) {
  if (!formUrl) return;
  window.location.href = formUrl;
}
