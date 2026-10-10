import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Smartphone, QrCode, DollarSign, CheckCircle2, 
  Clock, MapPin, Ticket, Percent, ArrowRight, RefreshCw, 
  Share2, Copy, Check, ShieldCheck, Sparkles, AlertCircle,
  TrendingUp, Award, UserCheck, Flame, ChevronRight, ChevronDown,
  Layers, GitFork, UserPlus, Sliders, XCircle, Send, CheckCircle,
  FileSpreadsheet, MessageSquare, History, PhoneCall, Filter, Eye, AlertTriangle
} from 'lucide-react';
import { getEvents, getShips, getBookings, createBooking } from '../db';

// ==========================================
// 1. ИЕРАРХИЧЕСКАЯ СТРУКТУРА: ТОЧКИ -> СТАТИКИ (ГЛАВНЫЕ) -> УЛИЧНЫЕ ПРОМОУТЕРЫ
// (Построена по аналогии с древовидными ветками Профилактики и историческим promo.gradnaneve.ru)
// ==========================================
export const INITIAL_PROMO_POINTS = [
  {
    id: 'point_palace',
    name: 'Причал «Дворцовая пристань» (Эрмитаж)',
    shortName: 'Дворцовая',
    address: 'Дворцовая наб., 36 (напротив Эрмитажа)',
    status: 'active',
    dailyTarget: 80000,
    statics: [
      {
        id: 'stat_andrey',
        name: 'Андрей Ковалев (Статик)',
        role: 'static',
        phone: '+7 (911) 100-22-33',
        staticPrecent: 6,    // % от оборота точки (базовый)
        staticPrecent2: 3,   // % бонусный при выполнении плана
        status: 'online',
        promoters: [
          {
            id: 'prom_ivan',
            name: 'Иван Захаров',
            role: 'promoter',
            spot: 'Дворцовая площадь / Арка Главного штаба',
            phone: '+7 (911) 234-56-78',
            promoterPrecent: 20, // 20% промоутеру
            status: 'online',
            avatar: 'ИЗ',
            activePace: 'hot' // горячая точка
          },
          {
            id: 'prom_sergey',
            name: 'Сергей Миронов',
            role: 'promoter',
            spot: 'Атланты / Миллионная улица',
            phone: '+7 (911) 456-78-90',
            promoterPrecent: 20,
            status: 'online',
            avatar: 'СМ',
            activePace: 'normal'
          }
        ]
      }
    ]
  },
  {
    id: 'point_senat',
    name: 'Причал «Медный Всадник» (Сенатская пристань)',
    shortName: 'Медный Всадник',
    address: 'Английская наб. / Сенатская пл.',
    status: 'active',
    dailyTarget: 60000,
    statics: [
      {
        id: 'stat_igor',
        name: 'Игорь Романов (Статик)',
        role: 'static',
        phone: '+7 (921) 200-44-55',
        staticPrecent: 7,
        staticPrecent2: 2,
        status: 'online',
        promoters: [
          {
            id: 'prom_elena',
            name: 'Елена Белова',
            role: 'promoter',
            spot: 'Спуск у Медного всадника / Набережная',
            phone: '+7 (921) 345-67-89',
            promoterPrecent: 20,
            status: 'online',
            avatar: 'ЕБ',
            activePace: 'hot'
          },
          {
            id: 'prom_daria',
            name: 'Дарья Соколова',
            role: 'promoter',
            spot: 'Александровский сад / Адмиралтейство',
            phone: '+7 (921) 789-01-23',
            promoterPrecent: 18,
            status: 'online',
            avatar: 'ДС',
            activePace: 'normal'
          }
        ]
      }
    ]
  },
  {
    id: 'point_arrow',
    name: 'Причал «Стрелка Васильевского острова»',
    shortName: 'Стрелка В.О.',
    address: 'Биржевая площадь / Ростральные колонны',
    status: 'active',
    dailyTarget: 50000,
    statics: [
      {
        id: 'stat_victor',
        name: 'Виктор Степанов (Статик)',
        role: 'static',
        phone: '+7 (905) 300-55-66',
        staticPrecent: 5,
        staticPrecent2: 3,
        status: 'online',
        promoters: [
          {
            id: 'prom_artem',
            name: 'Артем Смирнов',
            role: 'promoter',
            spot: 'Ростральные колонны / Мост',
            phone: '+7 (905) 567-89-01',
            promoterPrecent: 25,
            status: 'online',
            avatar: 'АС',
            activePace: 'hot'
          }
        ]
      }
    ]
  }
];

// Плоский список промоутеров для быстрого переключения сессии
export const ALL_PROMOTERS_LIST = INITIAL_PROMO_POINTS.flatMap(pt => 
  pt.statics.flatMap(st => 
    st.promoters.map(pr => ({
      ...pr,
      pointId: pt.id,
      pointName: pt.shortName,
      pointFullName: pt.name,
      staticId: st.id,
      staticName: st.name,
      commissionRate: pr.promoterPrecent / 100
    }))
  )
);

// Список статиков для режима диспетчера/главного промоутера
export const ALL_STATICS_LIST = INITIAL_PROMO_POINTS.flatMap(pt => 
  pt.statics.map(st => ({
    ...st,
    pointId: pt.id,
    pointName: pt.shortName,
    pointFullName: pt.name
  }))
);

// 2. ДЕМО ЗАЯВКИ НА СОГЛАСОВАНИЕ СКИДКИ / СПЕЦЦЕНЫ
export const INITIAL_DISCOUNT_REQUESTS = [
  {
    id: 'req_101',
    promoterId: 'prom_ivan',
    promoterName: 'Иван Захаров',
    pointName: 'Дворцовая',
    cruiseName: 'Рок Хит Нева: Легенды русского рока',
    time: '19:00',
    people: 4,
    basePrice: 1500,
    requestedPrice: 1100, // 4 x 1100 = 4400 вместо 6000
    timeWalk: 15, // минут до отправления
    paymentMethod: 'cash',
    comment: 'Семья с двумя подростками, колебались у арки. Готовы сразу налом при скидке 1100.',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    approvedBy: null
  },
  {
    id: 'req_102',
    promoterId: 'prom_elena',
    promoterName: 'Елена Белова',
    pointName: 'Медный Всадник',
    cruiseName: 'Джаз под разводными мостами',
    time: '23:50',
    people: 2,
    basePrice: 2000,
    requestedPrice: 1600,
    timeWalk: 40,
    paymentMethod: 'sbp_qr',
    comment: 'Пара туристов из Москвы, просят скидку как студентам.',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    approvedBy: 'Игорь Романов (Статик)'
  }
];

// 3. ДЕМО ЖУРНАЛ ОТКАЗОВ (REFUSES)
export const INITIAL_REFUSES = [
  {
    id: 'ref_201',
    promoterId: 'prom_artem',
    promoterName: 'Артем Смирнов',
    pointName: 'Стрелка В.О.',
    cruiseName: 'Парадный Петербург (М-177)',
    people: 3,
    price: 1500,
    reason: 'Дорого / Слишком высокая цена',
    timeWalk: 25,
    comment: 'Сказали, что у моста им предложили дешевле на катере по 1000 руб.',
    date: new Date(Date.now() - 1000 * 60 * 50).toISOString()
  },
  {
    id: 'ref_202',
    promoterId: 'prom_ivan',
    promoterName: 'Иван Захаров',
    pointName: 'Дворцовая',
    cruiseName: 'Рок Хит Нева: Легенды русского рока',
    people: 2,
    price: 1500,
    reason: 'Не успевают по времени / Спешат',
    timeWalk: 5,
    comment: 'Боялись опоздать на поезд с Московского вокзала.',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'ref_203',
    promoterId: 'prom_elena',
    promoterName: 'Елена Белова',
    pointName: 'Медный Всадник',
    cruiseName: 'Джаз под разводными мостами',
    people: 4,
    price: 2000,
    reason: 'Погода / Ветер на реке',
    timeWalk: 45,
    comment: 'Начался дождь, побоялись замерзнуть на открытой палубе.',
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
];
