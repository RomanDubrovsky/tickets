export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Платформа Продажи Билетов & Агрегатор API (Sputnik8 / Промоутеры / СКУД)",
    version: "2.0.0",
    description: `Единый технологический шлюз распределения инвентаря и продажи билетов на водные экскурсии.
    
    Ключевые возможности:
    - **Single Source of Truth**: единый динамический пул мест без риска овербукинга.
    - **Two-Phase Commit (Hold & Confirm)**: холдирование мест на время оформления (15 мин) и атомарное подтверждение.
    - **СКУД на причале**: генерация и моментальная валидация электронных билетов / QR-кодов контролерами.
    - **Поддержка свободной рассадки (Seatless)** и адресных мест.`
  },
  servers: [
    {
      url: "http://localhost:3001/api/v1",
      description: "Development Server"
    },
    {
      url: "https://api.gradnaneve.ru/api/v1",
      description: "Production Server"
    }
  ],
  tags: [
    { name: "Partner API", description: "Интерфейс для подключения внешних агрегаторов (Sputnik8, Яндекс.Афиша)" },
    { name: "Boarding & СКУД", description: "Контроль посадки и валидация QR-кодов на причале" },
    { name: "Legacy & Single Seats", description: "Поместная схема рассадки" }
  ],
  paths: {
    "/partner/trips": {
      get: {
        tags: ["Partner API"],
        summary: "Каталог активных рейсов и экскурсий",
        description: "Возвращает список доступных рейсов, теплоходов, координат причалов и базовых тарифов.",
        parameters: [
          { name: "date", in: "query", schema: { type: "string", format: "date" }, description: "Фильтр по дате (ГГГГ-ММ-ДД)" },
          { name: "ship_id", in: "query", schema: { type: "string" }, description: "Фильтр по конкретному судну" }
        ],
        responses: {
          "200": {
            description: "Список рейсов",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    count: { type: "integer" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          trip_id: { type: "string" },
                          title: { type: "string" },
                          description: { type: "string" },
                          date: { type: "string" },
                          departure_time: { type: "string" },
                          prices: {
                            type: "object",
                            properties: {
                              standard: { type: "number" },
                              vip: { type: "number" }
                            }
                          },
                          vessel: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              name: { type: "string" },
                              total_capacity: { type: "integer" },
                              pier_coordinates: { type: "object" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/partner/trips/{id}/availability": {
      get: {
        tags: ["Partner API"],
        summary: "Мгновенная проверка доступности мест (Availability Check)",
        description: "Возвращает точный остаток свободных мест с учетом активных броней в реальном времени (<100ms).",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID рейса (trip_id)" }
        ],
        responses: {
          "200": {
            description: "Информация о наличии мест",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        trip_id: { type: "string" },
                        date: { type: "string" },
                        departure_time: { type: "string" },
                        total_capacity: { type: "integer" },
                        booked_count: { type: "integer" },
                        held_count: { type: "integer" },
                        available_capacity: { type: "integer" },
                        is_sold_out: { type: "boolean" },
                        current_prices: {
                          type: "object",
                          properties: {
                            standard: { type: "number" },
                            vip: { type: "number" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": { description: "Рейс не найден" }
        }
      }
    },
    "/partner/orders/hold": {
      post: {
        tags: ["Partner API"],
        summary: "Заморозка мест на время чекаута (Hold Seats)",
        description: "Атомарно блокирует N мест на рейсе на 15 минут, предотвращая двойную продажу во время ввода карты клиентом на сайте Sputnik8.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["trip_id", "seats_count"],
                properties: {
                  trip_id: { type: "string", description: "ID рейса" },
                  seats_count: { type: "integer", default: 1, description: "Количество билетов" },
                  external_order_id: { type: "string", description: "ID заказа на стороне Sputnik8" },
                  ttl_minutes: { type: "integer", default: 15, description: "Время удержания (мин)" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Места успешно заблокированы",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        hold_id: { type: "string" },
                        trip_id: { type: "string" },
                        seats_count: { type: "integer" },
                        expires_at: { type: "string" },
                        ttl_seconds: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": { description: "Недостаточно свободных мест на рейсе (Capacity Exceeded)" }
        }
      }
    },
    "/partner/orders/confirm": {
      post: {
        tags: ["Partner API"],
        summary: "Подтверждение оплаты и выпуск билетов (Confirm & Issue Tickets)",
        description: "Финализирует продажу, списывает холд, создает запись бронирования и генерирует уникальные штрихкоды/QR-коды для каждого пассажира.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["hold_id", "trip_id"],
                properties: {
                  hold_id: { type: "string", description: "ID предварительного холда" },
                  trip_id: { type: "string", description: "ID рейса" },
                  external_order_id: { type: "string", description: "ID заказа в Sputnik8" },
                  seats_count: { type: "integer", default: 1 },
                  ticket_category: { type: "string", enum: ["standard", "vip"], default: "standard" },
                  agent_promo_code: { type: "string", example: "SPUTNIK8" },
                  customer_info: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      email: { type: "string" },
                      phone: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Заказ подтвержден, билеты выпущены",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        booking_id: { type: "string" },
                        status: { type: "string" },
                        total_price: { type: "number" },
                        seats_count: { type: "integer" },
                        tickets: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              ticket_code: { type: "string" },
                              category: { type: "string" },
                              price: { type: "number" },
                              qr_payload: { type: "string" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": { description: "Холд истек или не существует" }
        }
      }
    },
    "/partner/orders/cancel": {
      post: {
        tags: ["Partner API"],
        summary: "Отмена бронирования и возврат мест (Cancel / Refund)",
        description: "Аннулирует заказ и мгновенно возвращает билеты в общий доступный пул.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  booking_id: { type: "string" },
                  external_order_id: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Заказ аннулирован, места возвращены в продажу" },
          "404": { description: "Заказ не найден" }
        }
      }
    },
    "/boarding/validate": {
      post: {
        tags: ["Boarding & СКУД"],
        summary: "Валидация билета контролером на причале (СКУД)",
        description: "Проверяет действительность билета по ticket_code или QR-коду, гасит билет и блокирует повторные попытки прохода.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ticket_code"],
                properties: {
                  ticket_code: { type: "string", description: "Штрихкод/код билета (например SHP-2026-F9A1B2)" },
                  trip_id: { type: "string", description: "ID рейса у трапа (для сверки)" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Проход разрешен! Билет действителен и успешно погашен" },
          "400": { description: "Билет отменен или рейс не совпадает" },
          "404": { description: "Билет не найден в базе" },
          "409": { description: "Внимание! Билет уже был использован ранее (дубликат)" }
        }
      }
    }
  }
};
