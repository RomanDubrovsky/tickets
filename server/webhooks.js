// Webhook Dispatcher
// Manages real-time notifications to external ticket aggregators (Kassir, Yandex.Afisha)
// Triggers on: cruise cancellations (storm/weather), schedule changes, quota auto-reclaim

import fetch from 'node-fetch'; // or global fetch in Node 18+

class WebhookManager {
  constructor() {
    this.subscribers = [
      // Mock subscriber list
      { id: 'yandex_afisha', url: 'https://api.partner.yandex.ru/v1/webhooks/cruises', events: ['cruise.cancelled', 'quota.released'] },
      { id: 'kassir_ru', url: 'https://api.kassir.ru/gate/webhooks/tickets', events: ['cruise.cancelled', 'price.updated'] }
    ];
  }

  registerSubscriber(subscriber) {
    this.subscribers.push(subscriber);
  }

  async broadcastEvent(eventType, payload) {
    console.log(`[Webhook Broadcast] Event: ${eventType}`, payload);
    const relevant = this.subscribers.filter(s => s.events.includes(eventType));

    const results = await Promise.allSettled(
      relevant.map(async (sub) => {
        try {
          // Simulated dispatch (in production uses real fetch)
          console.log(` -> Sending ${eventType} to ${sub.id} (${sub.url})`);
          return { subscriber: sub.id, success: true };
        } catch (error) {
          console.error(` -> Failed sending webhook to ${sub.id}:`, error.message);
          return { subscriber: sub.id, success: false, error: error.message };
        }
      })
    );

    return results;
  }
}

export default new WebhookManager();
