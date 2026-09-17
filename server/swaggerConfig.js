export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Платформа Продажи Билетов API",
    version: "1.0.0",
    description: "API шлюз для интеграции билетных касс (Яндекс.Афиша, Kassir и др.) с единым пулом билетов."
  },
  servers: [
    {
      url: "http://localhost:3001/api/v1",
      description: "Local Development Server"
    }
  ],
  paths: {
    "/events": {
      get: {
        summary: "Получить список рейсов",
        responses: {
          "200": {
            description: "Успешный ответ",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { type: "object" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/tickets/availability": {
      get: {
        summary: "Проверить доступность мест на рейс",
        parameters: [
          {
            name: "eventId",
            in: "query",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Список занятых мест",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        eventId: { type: "string" },
                        unavailableSeats: { type: "array", items: { type: "string" } }
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
    "/tickets/hold": {
      post: {
        summary: "Временно заблокировать место (мягкая квота)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  eventId: { type: "string" },
                  seatId: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Место заблокировано",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        holdId: { type: "string" },
                        expiresAt: { type: "string" }
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
    "/tickets/book": {
      post: {
        summary: "Выкупить заблокированное место",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  eventId: { type: "string" },
                  seatId: { type: "string" },
                  holdId: { type: "string" },
                  promoCode: { type: "string" },
                  customerInfo: {
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
            description: "Билет успешно куплен",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        bookingId: { type: "string" },
                        message: { type: "string" }
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
};
