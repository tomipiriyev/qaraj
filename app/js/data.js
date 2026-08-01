/* Qaraj web app — data module.
   Static dataset; no backend. Photos live in ../images/ (spaces URL-encoded). */
(function (Q) {
  const P = "../images/photo_2026-06-";
  const IMG = {
    a: P + "23%2022.11.49.jpeg",
    b: P + "23%2022.11.55.jpeg",
    c: P + "23%2022.11.58.jpeg",
    d: P + "23%2022.12.02.jpeg",
    e: P + "23%2022.12.05.jpeg",
    f: P + "23%2022.12.07.jpeg",
    g: P + "23%2022.12.11.jpeg",
    h: P + "26%2015.32.46.jpeg",
    i: P + "26%2015.32.52.jpeg",
    j: P + "26%2015.32.55.jpeg",
    k: P + "26%2015.32.58.jpeg",
    l: P + "26%2015.33.02.jpeg",
    m: P + "26%2015.33.05.jpeg",
    n: P + "26%2015.33.09.jpeg",
  };

  const categories = [
    { id: "sklad",   label: "Склад",   sub: "Помещение целиком", icon: "box",
      hint: "Закрытое помещение под ключ — цена за место" },
    { id: "ploshad", label: "Площадь", sub: "Аренда по м²",       icon: "grid",
      hint: "Часть большого помещения — цена за м²" },
    { id: "garage",  label: "Гараж",   sub: "Бокс под авто",      icon: "garage",
      hint: "Отдельный гараж — цена за место, по размеру авто" },
  ];

  const amenities = [
    { id: "climate", label: "Климат-контроль", icon: "snow" },
    { id: "camera",  label: "Видеонаблюдение", icon: "cam" },
    { id: "access",  label: "Доступ 24/7",     icon: "clock" },
    { id: "smoke",   label: "Датчик дыма",     icon: "alert" },
    { id: "power",   label: "Электричество",   icon: "bolt" },
  ];

  const districts = [
    { id: "near",  name: "Рядом",           sub: "Найдём рядом с вами",     icon: "nav" },
    { id: "msk",   name: "Москва",          sub: "Часто ищут здесь",        icon: "city" },
    { id: "spb",   name: "Санкт-Петербург", sub: "Популярно для хранения",  icon: "bank" },
    { id: "kzn",   name: "Казань",          sub: "Новые площади",           icon: "home" },
  ];

  // price: ₽/mo for sklad & garage. pricePerM2: ₽/m² for ploshad (monthly = pricePerM2*sizeM2)
  const listings = [
    { id: "sk-1", category: "sklad",  title: "Сухой тёплый склад", city: "Москва", district: "Басманный",
      sizeM2: 8,  price: 6900,  rating: 4.90, reviews: 34, badge: "Проверено",
      amenities: ["climate","camera","access"], photos:[IMG.b,IMG.c,IMG.a], map:{x:20,y:33}, verified:true, availableNow:true,
      desc: "Отапливаемый склад в подвальном уровне жилого дома. Сухо круглый год, ровный пол, стеллажи по стенам." },
    { id: "sk-2", category: "sklad",  title: "Подвал-склад в центре", city: "Москва", district: "Тверской",
      sizeM2: 12, price: 8500,  rating: 4.88, reviews: 21, badge: "Проверено",
      amenities: ["camera","access","power"], photos:[IMG.c,IMG.a,IMG.e], map:{x:52,y:29}, verified:true, availableNow:true,
      desc: "Просторный сухой подвал с отдельным входом. Видеонаблюдение по периметру, доступ в любое время." },
    { id: "sk-3", category: "sklad",  title: "Складской бокс у метро", city: "Москва", district: "Пресненский",
      sizeM2: 15, price: 11500, rating: 4.75, reviews: 12, badge: null,
      amenities: ["climate","camera","access","power"], photos:[IMG.e,IMG.b], map:{x:35,y:53}, verified:false, availableNow:false,
      desc: "Тёплый складской бокс в 4 минутах от метро. Подойдёт под товарные запасы и сезонные вещи." },
    { id: "sk-4", category: "sklad",  title: "Мини-склад, чисто и сухо", city: "Казань", district: "Вахитовский",
      sizeM2: 6,  price: 4200,  rating: 4.65, reviews: 9, badge: "Проверено",
      amenities: ["climate","access"], photos:[IMG.a,IMG.c], map:{x:70,y:60}, verified:true, availableNow:true,
      desc: "Компактный мини-склад для коробок и мебели. Индивидуальный доступ по коду." },
    { id: "sk-5", category: "sklad",  title: "Тёплое помещение под ключ", city: "Санкт-Петербург", district: "Адмиралтейский",
      sizeM2: 20, price: 14000, rating: 4.82, reviews: 18, badge: null,
      amenities: ["climate","camera","access","smoke","power"], photos:[IMG.b,IMG.e,IMG.c], map:{x:80,y:36}, verified:true, availableNow:true,
      desc: "Отдельное закрытое помещение со всеми удобствами: климат-контроль, дым-датчик, электричество." },
    { id: "sk-6", category: "sklad",  title: "Склад с погрузочной рампой", city: "Москва", district: "Южнопортовый",
      sizeM2: 25, price: 16800, rating: 4.77, reviews: 16, badge: null,
      amenities: ["camera","access","smoke","power"], photos:[IMG.d,IMG.f], map:{x:12,y:48}, verified:true, availableNow:true,
      desc: "Складской блок с собственной рампой — удобно разгружать паллеты и крупногабарит. Высота потолков 3,2 м." },
    { id: "sk-7", category: "sklad",  title: "Кладовая в новостройке", city: "Москва", district: "Раменки",
      sizeM2: 4,  price: 3900,  rating: 4.68, reviews: 13, badge: "Проверено",
      amenities: ["climate","access"], photos:[IMG.f,IMG.a], map:{x:40,y:20}, verified:true, availableNow:true,
      desc: "Небольшая кладовая на цокольном этаже нового дома. Сухо, тепло, доступ по домофону в любое время." },
    { id: "sk-8", category: "sklad",  title: "Тёплый склад у ТТК", city: "Москва", district: "Сокольники",
      sizeM2: 18, price: 12900, rating: 4.71, reviews: 24, badge: null,
      amenities: ["climate","camera","access"], photos:[IMG.g,IMG.d,IMG.b], map:{x:64,y:15}, verified:false, availableNow:true,
      desc: "Отапливаемое помещение в охраняемом складском комплексе у Третьего кольца. Удобный подъезд для газели." },
    { id: "sk-9", category: "sklad",  title: "Сухой склад-лофт", city: "Санкт-Петербург", district: "Петроградский",
      sizeM2: 10, price: 9600,  rating: 4.86, reviews: 19, badge: "Проверено",
      amenities: ["climate","camera","access","smoke"], photos:[IMG.d,IMG.g], map:{x:30,y:75}, verified:true, availableNow:false,
      desc: "Склад в переоборудованном лофте: кирпичные стены, сухой воздух, видеонаблюдение в коридорах." },
    { id: "sk-10", category: "sklad", title: "Семейная кладовая", city: "Казань", district: "Кировский",
      sizeM2: 5,  price: 3600,  rating: 4.52, reviews: 6, badge: null,
      amenities: ["camera","access"], photos:[IMG.f,IMG.c], map:{x:88,y:70}, verified:false, availableNow:true,
      desc: "Аккуратная кладовая для сезонных вещей, колясок и спортинвентаря. Охрана и камеры на территории." },

    { id: "pl-1", category: "ploshad", title: "Место на складе (по м²)", city: "Москва", district: "Замоскворечье",
      sizeM2: 5,  pricePerM2: 450, rating: 4.60, reviews: 27, badge: "Площадь",
      amenities: ["camera","access"], photos:[IMG.j,IMG.i], map:{x:26,y:39}, verified:true, availableNow:true,
      desc: "Часть большого отапливаемого склада. Берите ровно столько метров, сколько нужно — платите помесячно." },
    { id: "pl-2", category: "ploshad", title: "Площадь на тёплом складе", city: "Москва", district: "Даниловский",
      sizeM2: 10, pricePerM2: 390, rating: 4.55, reviews: 14, badge: "Площадь",
      amenities: ["climate","camera","access","power"], photos:[IMG.i,IMG.k], map:{x:60,y:46}, verified:true, availableNow:true,
      desc: "Стеллажная зона на складе логистического центра. Погрузка/разгрузка, электричество на месте." },
    { id: "pl-3", category: "ploshad", title: "Метры под хранение", city: "Санкт-Петербург", district: "Московский",
      sizeM2: 3,  pricePerM2: 520, rating: 4.70, reviews: 8, badge: "Площадь",
      amenities: ["camera","access"], photos:[IMG.k,IMG.j], map:{x:85,y:43}, verified:false, availableNow:true,
      desc: "Небольшая площадь для сезонного хранения. Удобно для шин, велосипедов и коробок." },
    { id: "pl-4", category: "ploshad", title: "Складская площадь, 1-й этаж", city: "Казань", district: "Ново-Савиновский",
      sizeM2: 14, pricePerM2: 360, rating: 4.58, reviews: 11, badge: "Площадь",
      amenities: ["climate","camera","access","smoke","power"], photos:[IMG.h,IMG.i], map:{x:44,y:66}, verified:true, availableNow:false,
      desc: "Площадь на первом этаже склада с удобным подъездом. Все пять удобств на объекте." },
    { id: "pl-5", category: "ploshad", title: "Метры на паллетном складе", city: "Москва", district: "Южнопортовый",
      sizeM2: 8,  pricePerM2: 420, rating: 4.63, reviews: 16, badge: "Площадь",
      amenities: ["camera","access","power"], photos:[IMG.h,IMG.j], map:{x:18,y:58}, verified:true, availableNow:true,
      desc: "Паллетные места на действующем складском комплексе. Приёмка и отгрузка по будням, рохля на месте." },
    { id: "pl-6", category: "ploshad", title: "Площадь под интернет-магазин", city: "Москва", district: "Раменки",
      sizeM2: 12, pricePerM2: 380, rating: 4.66, reviews: 20, badge: "Площадь",
      amenities: ["climate","camera","access","power"], photos:[IMG.i,IMG.h], map:{x:48,y:70}, verified:true, availableNow:true,
      desc: "Тёплая зона хранения для товарных остатков. Розетки у стеллажей, можно организовать рабочее место." },
    { id: "pl-7", category: "ploshad", title: "Стеллажные метры", city: "Санкт-Петербург", district: "Невский",
      sizeM2: 6,  pricePerM2: 410, rating: 4.59, reviews: 9, badge: "Площадь",
      amenities: ["camera","access"], photos:[IMG.j,IMG.k,IMG.h], map:{x:74,y:28}, verified:false, availableNow:true,
      desc: "Ярусное хранение на стеллажах в сухом помещении. Подходит для архивов, коробок и лёгких товаров." },
    { id: "pl-8", category: "ploshad", title: "Площадь в тёплом ангаре", city: "Казань", district: "Авиастроительный",
      sizeM2: 20, pricePerM2: 330, rating: 4.49, reviews: 5, badge: "Площадь",
      amenities: ["camera","access","smoke"], photos:[IMG.k,IMG.h], map:{x:10,y:70}, verified:false, availableNow:false,
      desc: "Большая ровная площадь в отапливаемом ангаре. Заезд фуры к воротам, пожарная сигнализация." },
    { id: "pl-9", category: "ploshad", title: "Метры рядом с метро", city: "Санкт-Петербург", district: "Московский",
      sizeM2: 4,  pricePerM2: 500, rating: 4.74, reviews: 12, badge: "Площадь",
      amenities: ["climate","camera","access"], photos:[IMG.h,IMG.k,IMG.i], map:{x:56,y:80}, verified:true, availableNow:true,
      desc: "Небольшая площадь на складе в шаге от метро — удобно забирать вещи без машины." },

    { id: "ga-1", category: "garage", title: "Тёплый гараж", city: "Москва", district: "Хамовники",
      sizeM2: 18, price: 12000, rating: 4.95, reviews: 18, badge: "Гараж",
      amenities: ["climate","camera","access"], photos:[IMG.l,IMG.m,IMG.n], map:{x:52,y:40}, verified:true, availableNow:true,
      desc: "Отдельный отапливаемый бокс. Ровный пол, ворота с электроприводом, стеллажи. Помещается кроссовер." },
    { id: "ga-2", category: "garage", title: "Гараж-бокс с антресолью", city: "Москва", district: "Хамовники",
      sizeM2: 20, price: 11000, rating: 4.80, reviews: 22, badge: "Гараж",
      amenities: ["camera","access","power"], photos:[IMG.m,IMG.n,IMG.l], map:{x:35,y:53}, verified:true, availableNow:true,
      desc: "Капитальный гараж с антресолью для хранения. Смотровая яма, свет, розетки 220В." },
    { id: "ga-3", category: "garage", title: "Подземный тёплый бокс", city: "Москва", district: "Арбат",
      sizeM2: 16, price: 13500, rating: 4.85, reviews: 15, badge: "Гараж",
      amenities: ["climate","camera","access","smoke"], photos:[IMG.n,IMG.l], map:{x:60,y:60}, verified:true, availableNow:false,
      desc: "Бокс в подземном отапливаемом паркинге. Охрана, видеонаблюдение, круглосуточный доступ по карте." },
    { id: "ga-4", category: "garage", title: "Гараж под мотоциклы", city: "Санкт-Петербург", district: "Василеостровский",
      sizeM2: 14, price: 7800, rating: 4.72, reviews: 10, badge: "Гараж",
      amenities: ["camera","access","power"], photos:[IMG.m,IMG.l], map:{x:66,y:52}, verified:false, availableNow:true,
      desc: "Сухой гараж, оборудованный под мото- и велотехнику. Крепления на стенах, ровный сухой пол." },
    { id: "ga-5", category: "garage", title: "Просторный гараж, 2 авто", city: "Казань", district: "Советский",
      sizeM2: 34, price: 15000, rating: 4.78, reviews: 7, badge: "Гараж",
      amenities: ["climate","camera","access","smoke","power"], photos:[IMG.l,IMG.n,IMG.m], map:{x:26,y:63}, verified:true, availableNow:true,
      desc: "Большой бокс на два автомобиля со всеми удобствами. Подойдёт под хранение и мелкий ремонт." },
    { id: "ga-6", category: "garage", title: "Гараж с ямой и светом", city: "Москва", district: "Сокольники",
      sizeM2: 19, price: 9800,  rating: 4.69, reviews: 14, badge: "Гараж",
      amenities: ["camera","access","power"], photos:[IMG.n,IMG.m], map:{x:70,y:44}, verified:true, availableNow:true,
      desc: "Капитальный гараж со смотровой ямой и хорошим освещением. Розетки, верстак, полки для инструмента." },
    { id: "ga-7", category: "garage", title: "Бокс в кооперативе", city: "Москва", district: "Южнопортовый",
      sizeM2: 17, price: 8500,  rating: 4.61, reviews: 11, badge: null,
      amenities: ["access","power"], photos:[IMG.l,IMG.m], map:{x:38,y:42}, verified:false, availableNow:true,
      desc: "Сухой бокс в охраняемом гаражном кооперативе. Круглосуточный заезд через шлагбаум." },
    { id: "ga-8", category: "garage", title: "Тёплый бокс у метро", city: "Санкт-Петербург", district: "Невский",
      sizeM2: 21, price: 11500, rating: 4.83, reviews: 17, badge: "Гараж",
      amenities: ["climate","camera","access"], photos:[IMG.m,IMG.l,IMG.n], map:{x:82,y:58}, verified:true, availableNow:false,
      desc: "Отапливаемый бокс в 6 минутах от метро. Подходит под хранение авто и мототехники зимой." },
    { id: "ga-9", category: "garage", title: "Гараж с высокими воротами", city: "Санкт-Петербург", district: "Петроградский",
      sizeM2: 24, price: 13900, rating: 4.76, reviews: 8, badge: "Гараж",
      amenities: ["camera","access","smoke","power"], photos:[IMG.n,IMG.l], map:{x:22,y:26}, verified:true, availableNow:true,
      desc: "Просторный гараж с воротами 2,4 м — помещается кроссовер с боксом на крыше. Дым-датчик и розетки." },
   { id: "ga-10", category: "garage", title: "Недорогой гараж", city: "Казань", district: "Советский",
     sizeM2: 15, price: 6900,  rating: 4.57, reviews: 13, badge: "Гараж",
     amenities: ["access","power"], photos:[IMG.m,IMG.n], map:{x:46,y:34}, verified:false, availableNow:true,
     desc: "Простой надёжный гараж для седана или хранения вещей. Свет и розетка есть, заезд удобный." },
    { id: "sk-11", category: "sklad",  title: "Склад в Чертаново", city: "Москва", district: "Чертаново Южное",
      sizeM2: 22, price: 14500, rating: 4.79, reviews: 15, badge: null,
      amenities: ["climate","camera","access","power"], photos:[IMG.h,IMG.i], map:{x:15,y:60}, verified:true, availableNow:true,
      desc: "Сухой тёплый склад в отдельном блоке. Ровный пол, электричество, удобный подъезд для газели." },
    { id: "sk-12", category: "sklad",  title: "Центральная кладовая", city: "Санкт-Петербург", district: "Центральный",
      sizeM2: 16, price: 10800, rating: 4.84, reviews: 22, badge: "Проверено",
      amenities: ["camera","access","smoke"], photos:[IMG.i,IMG.j], map:{x:33,y:18}, verified:true, availableNow:true,
      desc: "Кладовая в центре города, в шаге от метро. Сухо, чисто, датчик дыма, круглосуточный доступ." },
    { id: "sk-13", category: "sklad",  title: "Склад-лофт в Московском районе", city: "Казань", district: "Московский",
      sizeM2: 9,  price: 5400,  rating: 4.61, reviews: 10, badge: null,
      amenities: ["climate","access"], photos:[IMG.j,IMG.k], map:{x:78,y:74}, verified:false, availableNow:true,
      desc: "Небольшой склад в переоборудованном промышленном здании. Высокие потолки, климат-контроль." },
    { id: "sk-14", category: "sklad",  title: "Большой склад в Люблино", city: "Москва", district: "Люблино",
      sizeM2: 30, price: 19800, rating: 4.73, reviews: 19, badge: "Проверено",
      amenities: ["camera","access","power","smoke"], photos:[IMG.k,IMG.l], map:{x:58,y:85}, verified:true, availableNow:false,
      desc: "Просторное помещение под товары или переезд. Охрана, электричество, пожарная сигнализация." },
    { id: "sk-15", category: "sklad",  title: "Компактный склад на Фрунзенской", city: "Санкт-Петербург", district: "Фрунзенский",
      sizeM2: 7,  price: 6200,  rating: 4.56, reviews: 7, badge: null,
      amenities: ["climate","camera","access"], photos:[IMG.l,IMG.m], map:{x:49,y:67}, verified:true, availableNow:true,
      desc: "Тёплая кладовая для сезонных вещей и инвентаря. Камеры, доступ по пропуску." },

    { id: "pl-10", category: "ploshad", title: "Метры на складе в Дорогомилово", city: "Москва", district: "Дорогомилово",
      sizeM2: 7,  pricePerM2: 400, rating: 4.62, reviews: 14, badge: "Площадь",
      amenities: ["camera","access","power"], photos:[IMG.a,IMG.b], map:{x:24,y:31}, verified:true, availableNow:true,
      desc: "Часть отапливаемого склада рядом с метро. Розетки у места, удобная погрузка." },
    { id: "pl-11", category: "ploshad", title: "Площадь в Красногвардейском", city: "Санкт-Петербург", district: "Красногвардейский",
      sizeM2: 9,  pricePerM2: 380, rating: 4.51, reviews: 6, badge: "Площадь",
      amenities: ["camera","access"], photos:[IMG.b,IMG.c], map:{x:67,y:22}, verified:false, availableNow:true,
      desc: "Стеллажные метры на действующем складе. Сухое помещение, видеонаблюдение." },
    { id: "pl-12", category: "ploshad", title: "Складская площадь в Свердловском", city: "Казань", district: "Свердловский",
      sizeM2: 15, pricePerM2: 350, rating: 4.67, reviews: 11, badge: "Площадь",
      amenities: ["climate","camera","access","smoke"], photos:[IMG.c,IMG.d], map:{x:92,y:55}, verified:true, availableNow:false,
      desc: "Ровная площадь в тёплом складе. Пожарная сигнализация, климат-контроль." },
    { id: "pl-13", category: "ploshad", title: "Метры в Бутово", city: "Москва", district: "Бутово",
      sizeM2: 6,  pricePerM2: 460, rating: 4.71, reviews: 9, badge: "Площадь",
      amenities: ["camera","access"], photos:[IMG.d,IMG.e], map:{x:8,y:44}, verified:true, availableNow:true,
      desc: "Небольшая площадь для коробок и сезонного хранения. Удобный заезд в любое время." },
    { id: "pl-14", category: "ploshad", title: "Площадь на Выборгской", city: "Санкт-Петербург", district: "Выборгский",
      sizeM2: 11, pricePerM2: 370, rating: 4.59, reviews: 13, badge: "Площадь",
      amenities: ["climate","access","power"], photos:[IMG.e,IMG.f], map:{x:41,y:12}, verified:false, availableNow:true,
      desc: "Тёплая площадь с розетками для хранения и небольшой сборки заказов." },

    { id: "ga-11", category: "garage", title: "Тёплый бокс в Медведково", city: "Москва", district: "Медведково",
      sizeM2: 23, price: 12500, rating: 4.81, reviews: 20, badge: "Гараж",
      amenities: ["climate","camera","access"], photos:[IMG.a,IMG.b], map:{x:55,y:8}, verified:true, availableNow:true,
      desc: "Отапливаемый бокс в охраняемом комплексе. Видеонаблюдение, круглосуточный заезд." },
    { id: "ga-12", category: "garage", title: "Гараж в Калининском", city: "Санкт-Петербург", district: "Калининский",
      sizeM2: 18, price: 9200,  rating: 4.64, reviews: 12, badge: "Гараж",
      amenities: ["camera","access","power"], photos:[IMG.b,IMG.c], map:{x:14,y:52}, verified:true, availableNow:true,
      desc: "Сухой капитальный гараж со светом и розетками. Подходит для седана и мотоцикла." },
    { id: "ga-13", category: "garage", title: "Бокс в Ново-Савиновском", city: "Казань", district: "Ново-Савиновский",
      sizeM2: 20, price: 10400, rating: 4.58, reviews: 8,  badge: null,
      amenities: ["access","power"], photos:[IMG.c,IMG.d], map:{x:86,y:38}, verified:false, availableNow:true,
      desc: "Просторный бокс с электричеством. Удобный заезд, шлагбаум на въезде." },
    { id: "ga-14", category: "garage", title: "Большой гараж в Отрадном", city: "Москва", district: "Отрадное",
      sizeM2: 27, price: 14200, rating: 4.77, reviews: 16, badge: "Гараж",
      amenities: ["camera","access","smoke","power"], photos:[IMG.d,IMG.e], map:{x:63,y:72}, verified:true, availableNow:false,
      desc: "Вместительный гараж для кроссовера или микроавтобуса. Дым-датчик, розетки, камеры." },
    { id: "ga-15", category: "garage", title: "Бокс в Приморском", city: "Санкт-Петербург", district: "Приморский",
      sizeM2: 22, price: 11800, rating: 4.80, reviews: 18, badge: "Гараж",
      amenities: ["climate","camera","access"], photos:[IMG.e,IMG.f], map:{x:29,y:25}, verified:true, availableNow:true,
      desc: "Тёплый бокс у метро с климат-контролем. Хороший вариант для зимнего хранения авто." },

    // Open-air spots — the "Открытая стоянка" side of the Гараж category
    { id: "ga-26", category: "garage", title: "Место на охраняемой стоянке", city: "Москва", district: "Южнопортовый",
      sizeM2: 15, price: 5400,  rating: 4.52, reviews: 26, badge: null,
      amenities: ["camera","access"], photos:[IMG.l,IMG.n], map:{x:44,y:66}, verified:true, availableNow:true,
      desc: "Размеченное машиноместо на охраняемой стоянке. Шлагбаум, освещение, круглосуточный въезд." },
    { id: "ga-27", category: "garage", title: "Открытое машиноместо во дворе", city: "Санкт-Петербург", district: "Невский",
      sizeM2: 13, price: 5200,  rating: 4.44, reviews: 9,  badge: null,
      amenities: ["access"], photos:[IMG.m,IMG.l], map:{x:74,y:22}, verified:false, availableNow:true,
      desc: "Место во дворе жилого дома с отдельным заездом. Освещение по периметру, тихий двор." },
    { id: "ga-28", category: "garage", title: "Парковка под навесом", city: "Казань", district: "Вахитовский",
      sizeM2: 16, price: 6200,  rating: 4.66, reviews: 15, badge: "Проверено",
      amenities: ["camera","access"], photos:[IMG.n,IMG.m], map:{x:31,y:14}, verified:true, availableNow:true,
      desc: "Машиноместо под навесом: снег и град не страшны. Видеонаблюдение, широкий заезд." },
    { id: "ga-29", category: "garage", title: "Стоянка для фургонов", city: "Москва", district: "Отрадное",
      sizeM2: 26, price: 8900,  rating: 4.58, reviews: 11, badge: null,
      amenities: ["camera","access","power"], photos:[IMG.l,IMG.m], map:{x:18,y:74}, verified:true, availableNow:false,
      desc: "Просторные места под фургоны и микроавтобусы. Охрана, автоматические ворота, розетка 220 В." },

    { id: "sk-16", category: "sklad",  title: "Склад в Марьино", city: "Москва", district: "Марьино",
      sizeM2: 14, price: 9800,  rating: 4.66, reviews: 12, badge: null,
      amenities: ["camera","access","power"], photos:[IMG.a,IMG.d], map:{x:71,y:41}, verified:true, availableNow:true,
      desc: "Сухой склад в охраняемом комплексе у кольцевой. Электричество, стеллажи, удобный подъезд." },
    { id: "sk-17", category: "sklad",  title: "Тёплая кладовая в Кунцево", city: "Москва", district: "Кунцево",
      sizeM2: 10, price: 8200,  rating: 4.74, reviews: 16, badge: "Проверено",
      amenities: ["climate","camera","access"], photos:[IMG.c,IMG.f], map:{x:17,y:22}, verified:true, availableNow:true,
      desc: "Отапливаемая кладовая в жилом районе. Климат-контроль, доступ круглосуточно по пропуску." },
    { id: "sk-18", category: "sklad",  title: "Склад в Кировском районе", city: "Санкт-Петербург", district: "Кировский",
      sizeM2: 17, price: 11900, rating: 4.70, reviews: 14, badge: null,
      amenities: ["camera","access","smoke"], photos:[IMG.g,IMG.b], map:{x:57,y:48}, verified:false, availableNow:true,
      desc: "Просторное помещение под хранение мебели и техники. Пожарная сигнализация, видеонаблюдение." },
    { id: "sk-19", category: "sklad",  title: "Мини-склад в Приволжском", city: "Казань", district: "Приволжский",
      sizeM2: 8,  price: 4700,  rating: 4.54, reviews: 8,  badge: null,
      amenities: ["camera","access"], photos:[IMG.e,IMG.a], map:{x:84,y:19}, verified:true, availableNow:false,
      desc: "Компактный склад для коробок и архива. Сухое помещение, охрана территории." },
    { id: "sk-20", category: "sklad",  title: "Склад в Строгино", city: "Москва", district: "Строгино",
      sizeM2: 12, price: 9900,  rating: 4.81, reviews: 21, badge: "Проверено",
      amenities: ["climate","camera","access","power"], photos:[IMG.b,IMG.g], map:{x:9,y:36}, verified:true, availableNow:true,
      desc: "Тёплый сухой склад с розетками и стеллажами. Подходит для товаров интернет-магазина." },
    { id: "sk-21", category: "sklad",  title: "Большой склад у метро", city: "Санкт-Петербург", district: "Московский",
      sizeM2: 22, price: 15200, rating: 4.78, reviews: 17, badge: null,
      amenities: ["climate","camera","access","smoke","power"], photos:[IMG.d,IMG.c], map:{x:38,y:88}, verified:true, availableNow:true,
      desc: "Помещение со всеми удобствами в 5 минутах от метро. Ровный пол, высота потолков 3 м." },
    { id: "sk-22", category: "sklad",  title: "Кладовая на Таганке", city: "Москва", district: "Таганский",
      sizeM2: 6,  price: 7500,  rating: 4.69, reviews: 11, badge: "Проверено",
      amenities: ["climate","access"], photos:[IMG.f,IMG.e], map:{x:47,y:55}, verified:true, availableNow:true,
      desc: "Небольшая кладовая в центре — удобно хранить сезонные вещи рядом с домом." },
    { id: "sk-23", category: "sklad",  title: "Сухой склад в Вахитовском", city: "Казань", district: "Вахитовский",
      sizeM2: 11, price: 6800,  rating: 4.62, reviews: 9,  badge: null,
      amenities: ["camera","access","power"], photos:[IMG.a,IMG.g], map:{x:65,y:82}, verified:false, availableNow:true,
      desc: "Сухое тёплое помещение с отдельным входом. Розетки, видеонаблюдение в коридоре." },
    { id: "sk-24", category: "sklad",  title: "Склад в Красносельском", city: "Санкт-Петербург", district: "Красносельский",
      sizeM2: 28, price: 16900, rating: 4.72, reviews: 13, badge: null,
      amenities: ["camera","access","smoke","power"], photos:[IMG.c,IMG.d], map:{x:22,y:64}, verified:true, availableNow:false,
      desc: "Вместительный склад под переезд или товарные запасы. Погрузочная зона у входа." },
    { id: "sk-25", category: "sklad",  title: "Тёплый склад в Войковском", city: "Москва", district: "Войковский",
      sizeM2: 9,  price: 7900,  rating: 4.77, reviews: 15, badge: "Проверено",
      amenities: ["climate","camera","access"], photos:[IMG.g,IMG.f], map:{x:33,y:47}, verified:true, availableNow:true,
      desc: "Аккуратный отапливаемый склад рядом с метро. Климат-контроль, стеллажи включены." },

    { id: "pl-15", category: "ploshad", title: "Площадь в Хорошёвском", city: "Москва", district: "Хорошёвский",
      sizeM2: 8,  pricePerM2: 410, rating: 4.64, reviews: 10, badge: "Площадь",
      amenities: ["camera","access","power"], photos:[IMG.h,IMG.k], map:{x:51,y:17}, verified:true, availableNow:true,
      desc: "Метры на действующем складе с розетками. Удобная погрузка, рохля на месте." },
    { id: "pl-16", category: "ploshad", title: "Метры в Невском районе", city: "Санкт-Петербург", district: "Невский",
      sizeM2: 12, pricePerM2: 395, rating: 4.57, reviews: 7,  badge: "Площадь",
      amenities: ["camera","access"], photos:[IMG.j,IMG.h], map:{x:76,y:66}, verified:false, availableNow:true,
      desc: "Стеллажная зона на тёплом складе. Сухое помещение, круглосуточный доступ." },
    { id: "pl-17", category: "ploshad", title: "Площадь в Кировском", city: "Казань", district: "Кировский",
      sizeM2: 5,  pricePerM2: 340, rating: 4.48, reviews: 5,  badge: "Площадь",
      amenities: ["camera","access"], photos:[IMG.i,IMG.j], map:{x:59,y:73}, verified:true, availableNow:true,
      desc: "Небольшая площадь под коробки и сезонные вещи. Охраняемая территория." },
    { id: "pl-18", category: "ploshad", title: "Метры у Аэропорта", city: "Москва", district: "Аэропорт",
      sizeM2: 15, pricePerM2: 430, rating: 4.73, reviews: 13, badge: "Площадь",
      amenities: ["climate","camera","access","power"], photos:[IMG.k,IMG.i], map:{x:28,y:58}, verified:true, availableNow:false,
      desc: "Тёплая зона хранения с климат-контролем. Подходит под товарные остатки и архив." },
    { id: "pl-19", category: "ploshad", title: "Площадь в Приморском", city: "Санкт-Петербург", district: "Приморский",
      sizeM2: 6,  pricePerM2: 445, rating: 4.68, reviews: 11, badge: "Площадь",
      amenities: ["climate","camera","access"], photos:[IMG.h,IMG.j], map:{x:13,y:29}, verified:true, availableNow:true,
      desc: "Метры на складе в шаге от метро. Удобно забирать вещи без машины." },
    { id: "pl-20", category: "ploshad", title: "Складские метры в Зюзино", city: "Москва", district: "Зюзино",
      sizeM2: 10, pricePerM2: 375, rating: 4.60, reviews: 8,  badge: "Площадь",
      amenities: ["camera","access","smoke"], photos:[IMG.i,IMG.h], map:{x:43,y:35}, verified:false, availableNow:true,
      desc: "Ровная площадь на охраняемом складе. Пожарная сигнализация, заезд для газели." },
    { id: "pl-21", category: "ploshad", title: "Площадь в ангаре", city: "Казань", district: "Авиастроительный",
      sizeM2: 18, pricePerM2: 320, rating: 4.53, reviews: 6,  badge: "Площадь",
      amenities: ["camera","access","power"], photos:[IMG.k,IMG.j], map:{x:90,y:44}, verified:false, availableNow:true,
      desc: "Большая площадь в отапливаемом ангаре. Заезд фуры к воротам, электричество." },
    { id: "pl-22", category: "ploshad", title: "Метры на Выборгской стороне", city: "Санкт-Петербург", district: "Выборгский",
      sizeM2: 4,  pricePerM2: 480, rating: 4.76, reviews: 9,  badge: "Площадь",
      amenities: ["climate","camera","access"], photos:[IMG.j,IMG.k], map:{x:69,y:10}, verified:true, availableNow:true,
      desc: "Компактная площадь под шины, велосипеды и коробки. Климат-контроль, камеры." },
    { id: "pl-23", category: "ploshad", title: "Площадь в Савёловском", city: "Москва", district: "Савёловский",
      sizeM2: 9,  pricePerM2: 405, rating: 4.65, reviews: 12, badge: "Площадь",
      amenities: ["camera","access","power"], photos:[IMG.h,IMG.i], map:{x:36,y:69}, verified:true, availableNow:true,
      desc: "Стеллажные метры рядом с вокзалом. Розетки у места, удобная разгрузка." },
    { id: "pl-24", category: "ploshad", title: "Метры на Фрунзенской", city: "Санкт-Петербург", district: "Фрунзенский",
      sizeM2: 13, pricePerM2: 390, rating: 4.61, reviews: 10, badge: "Площадь",
      amenities: ["climate","camera","access","smoke"], photos:[IMG.i,IMG.k], map:{x:54,y:90}, verified:true, availableNow:false,
      desc: "Тёплая площадь для хранения и сборки заказов. Дым-датчик, видеонаблюдение." },

    { id: "ga-16", category: "garage", title: "Гараж в Крылатском", city: "Москва", district: "Крылатское",
      sizeM2: 19, price: 12800, rating: 4.82, reviews: 19, badge: "Гараж",
      amenities: ["climate","camera","access"], photos:[IMG.l,IMG.n], map:{x:11,y:18}, verified:true, availableNow:true,
      desc: "Отапливаемый бокс в охраняемом кооперативе. Ворота с приводом, стеллажи." },
    { id: "ga-17", category: "garage", title: "Бокс в Красногвардейском", city: "Санкт-Петербург", district: "Красногвардейский",
      sizeM2: 17, price: 8900,  rating: 4.66, reviews: 12, badge: "Гараж",
      amenities: ["camera","access","power"], photos:[IMG.m,IMG.l], map:{x:73,y:33}, verified:true, availableNow:true,
      desc: "Сухой капитальный бокс со светом и розетками. Круглосуточный заезд." },
    { id: "ga-18", category: "garage", title: "Гараж у реки", city: "Казань", district: "Советский",
      sizeM2: 21, price: 9600,  rating: 4.59, reviews: 9,  badge: null,
      amenities: ["access","power"], photos:[IMG.n,IMG.m], map:{x:87,y:62}, verified:false, availableNow:true,
      desc: "Просторный гараж с электричеством в тихом кооперативе. Удобный подъезд." },
    { id: "ga-19", category: "garage", title: "Тёплый бокс в Гагаринском", city: "Москва", district: "Гагаринский",
      sizeM2: 16, price: 13200, rating: 4.86, reviews: 23, badge: "Гараж",
      amenities: ["climate","camera","access","smoke"], photos:[IMG.l,IMG.m], map:{x:31,y:50}, verified:true, availableNow:false,
      desc: "Бокс в подземном паркинге с охраной. Климат-контроль, доступ по карте 24/7." },
    { id: "ga-20", category: "garage", title: "Гараж в Кировском", city: "Санкт-Петербург", district: "Кировский",
      sizeM2: 18, price: 8400,  rating: 4.63, reviews: 11, badge: "Гараж",
      amenities: ["camera","access","power"], photos:[IMG.m,IMG.n], map:{x:50,y:77}, verified:true, availableNow:true,
      desc: "Надёжный гараж для седана или хранения. Свет, розетки, сухой пол." },
    { id: "ga-21", category: "garage", title: "Просторный бокс в Марьино", city: "Москва", district: "Марьино",
      sizeM2: 24, price: 11900, rating: 4.71, reviews: 14, badge: "Гараж",
      amenities: ["camera","access","smoke","power"], photos:[IMG.n,IMG.l], map:{x:68,y:56}, verified:true, availableNow:true,
      desc: "Вместительный бокс под кроссовер с боксом на крыше. Дым-датчик, верстак." },
    { id: "ga-22", category: "garage", title: "Недорогой бокс", city: "Казань", district: "Приволжский",
      sizeM2: 15, price: 7300,  rating: 4.55, reviews: 7,  badge: null,
      amenities: ["access","power"], photos:[IMG.l,IMG.n], map:{x:19,y:80}, verified:false, availableNow:true,
      desc: "Простой сухой бокс для авто или вещей. Заезд через шлагбаум в любое время." },
    { id: "ga-23", category: "garage", title: "Гараж у Московской", city: "Санкт-Петербург", district: "Московский",
      sizeM2: 20, price: 10900, rating: 4.78, reviews: 16, badge: "Гараж",
      amenities: ["climate","camera","access"], photos:[IMG.m,IMG.l], map:{x:44,y:27}, verified:true, availableNow:true,
      desc: "Тёплый гараж в 7 минутах от метро. Подходит для зимнего хранения авто и мото." },
    { id: "ga-24", category: "garage", title: "Бокс в Бутово", city: "Москва", district: "Бутово",
      sizeM2: 22, price: 10400, rating: 4.68, reviews: 13, badge: "Гараж",
      amenities: ["camera","access","power"], photos:[IMG.n,IMG.m], map:{x:6,y:52}, verified:true, availableNow:true,
      desc: "Капитальный бокс с антресолью и розетками. Охрана, видеонаблюдение на въезде." },
    { id: "ga-25", category: "garage", title: "Гараж на Васильевском", city: "Санкт-Петербург", district: "Василеостровский",
      sizeM2: 25, price: 14700, rating: 4.84, reviews: 21, badge: "Гараж",
      amenities: ["climate","camera","access","smoke","power"], photos:[IMG.l,IMG.m], map:{x:62,y:6}, verified:true, availableNow:true,
      desc: "Большой тёплый гараж со всеми удобствами. Помещается микроавтобус, есть яма." },
  ];

  // monthly price for any listing
  function monthly(l){ return l.category === "ploshad" ? l.pricePerM2 * l.sizeM2 : l.price; }
  function priceLabel(l){
    if (l.category === "ploshad") return { main: fmt(l.pricePerM2) + " ₽", unit: "/ м² · мес" };
    return { main: fmt(l.price) + " ₽", unit: "/ мес" };
  }
  function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  function placesWord(n){ const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return "место";
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return "места";
    return "мест"; }
  function garagesWord(n){ const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return "гараж";
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return "гаража";
    return "гаражей"; }

  /* ---------- Garage search (the "Поиск гаража" filter page) ----------
     The Гараж category carries attributes the other two don't: what fits inside,
     open-air vs closed, and its own feature list. They live in GARAGE_META keyed
     by listing id and are merged onto the listings below, so the big listings
     array above stays readable. */
  const vehicleTypes = [
    { id: "car",  label: "Легковой",    sub: "до 4,5 м",  icon: "car" },
    { id: "moto", label: "Мотоцикл",    sub: "до 2,5 м",  icon: "moto" },
    { id: "suv",  label: "Внедорожник", sub: "до 5,2 м",  icon: "suv" },
    { id: "van",  label: "Фургон",      sub: "до 6,0 м",  icon: "van" },
  ];
  const parkingTypes = [
    { id: "outdoor", label: "Открытая стоянка", desc: "Парковка под открытым небом.", icon: "sun" },
    { id: "indoor",  label: "Крытый гараж",     desc: "Гараж или крытый паркинг.",     icon: "garage" },
  ];
  const garageFeatures = [
    { id: "cctv",    label: "Видеонаблюдение",   icon: "cam" },
    { id: "light",   label: "Освещение",         icon: "bulb" },
    { id: "ev",      label: "Зарядка электро",   icon: "bolt" },
    { id: "socket",  label: "Розетка 220 В",     icon: "plug" },
    { id: "gate",    label: "Автоворота",        icon: "gate" },
    { id: "guard",   label: "Охрана",            icon: "shield" },
    { id: "always",  label: "Доступ 24/7",       icon: "clock" },
    { id: "covered", label: "Крытое",            icon: "roof" },
    { id: "weather", label: "Защита от осадков", icon: "umbrella" },
    { id: "large",   label: "Для крупных авто",  icon: "truck" },
  ];
  const radiusOptions = [
    { km: 1,  label: "До 1 км" },
    { km: 3,  label: "До 3 км" },
    { km: 5,  label: "До 5 км" },
    { km: 10, label: "До 10 км" },
    { km: 0,  label: "Любое расстояние" },
  ];
  const sortOptions = [
    { id: "rec",    label: "Рекомендуемые" },
    { id: "cheap",  label: "Сначала дешёвые" },
    { id: "pricey", label: "Сначала дорогие" },
    { id: "near",   label: "Ближайшие" },
    { id: "rated",  label: "С высоким рейтингом" },
    { id: "new",    label: "Сначала новые" },
  ];
  // slider domain, rounded outward from the real garage prices (5 200 – 15 000 ₽)
  const GARAGE_PRICE = { min: 5000, max: 20000, step: 500 };

  // [vehicles, parking, features, km from centre, days since listed, free-from offset in days]
  const GARAGE_META = {
    "ga-1":  [["car","suv"],       "indoor",  ["cctv","light","always","covered","weather"], 1.2, 40, 0],
    "ga-2":  [["car","suv"],       "indoor",  ["cctv","light","socket","always","covered"], 2.4, 26, 0],
    "ga-3":  [["car"],             "indoor",  ["cctv","light","gate","guard","always","covered","weather"], 0.8, 12, 21],
    "ga-4":  [["moto"],            "indoor",  ["cctv","socket","always","covered"], 3.6, 55, 0],
    "ga-5":  [["car","suv","van"], "indoor",  ["cctv","light","ev","socket","gate","always","covered","weather","large"], 6.5, 8, 0],
    "ga-6":  [["car","suv"],       "indoor",  ["cctv","light","socket","always","covered"], 4.2, 33, 0],
    "ga-7":  [["car"],             "indoor",  ["light","socket","always","covered"], 2.9, 47, 0],
    "ga-8":  [["car","suv"],       "indoor",  ["cctv","light","always","covered","weather"], 1.6, 20, 14],
    "ga-9":  [["car","suv","van"], "indoor",  ["cctv","light","socket","gate","always","covered","large"], 5.1, 15, 0],
    "ga-10": [["car"],             "indoor",  ["light","socket","always","covered"], 8.4, 60, 0],
    "ga-11": [["car","suv"],       "indoor",  ["cctv","light","always","covered","weather"], 9.2, 5, 0],
    "ga-12": [["car","suv"],       "indoor",  ["cctv","socket","always","covered"], 7.3, 44, 0],
    "ga-13": [["car","suv"],       "indoor",  ["light","socket","covered"], 11.5, 30, 0],
    "ga-14": [["car","suv","van"], "indoor",  ["cctv","light","socket","gate","always","covered","large"], 12.8, 18, 30],
    "ga-15": [["car","suv"],       "indoor",  ["cctv","light","always","covered","weather"], 6.1, 10, 0],
    "ga-16": [["car","suv"],       "indoor",  ["cctv","light","always","covered","weather"], 3.4, 24, 0],
    "ga-17": [["car","moto"],      "indoor",  ["cctv","light","socket","always","covered"], 4.9, 36, 0],
    "ga-18": [["car","suv"],       "indoor",  ["light","socket","covered"], 7.8, 52, 0],
    "ga-19": [["car"],             "indoor",  ["cctv","light","gate","guard","always","covered","weather"], 2.1, 9, 7],
    "ga-20": [["car","suv"],       "indoor",  ["cctv","light","socket","always","covered"], 9.6, 41, 0],
    "ga-21": [["car","suv","van"], "indoor",  ["cctv","light","socket","gate","always","covered","large"], 10.7, 16, 0],
    "ga-22": [["car","moto"],      "indoor",  ["light","always","covered"], 13.2, 58, 0],
    "ga-23": [["car","moto","suv"],"indoor",  ["cctv","light","always","covered","weather"], 5.6, 22, 0],
    "ga-24": [["car","suv","van"], "indoor",  ["cctv","light","socket","always","covered","large"], 14.5, 28, 0],
    "ga-25": [["car","suv","van"], "indoor",  ["cctv","light","ev","socket","gate","always","covered","weather","large"], 8.9, 6, 0],
    "ga-26": [["car","suv"],       "outdoor", ["cctv","light","guard","gate","always","large"], 3.1, 3, 0],
    "ga-27": [["car","moto"],      "outdoor", ["light","always"], 2.2, 22, 0],
    "ga-28": [["car","suv","van"], "outdoor", ["cctv","light","weather","large","always"], 4.7, 14, 0],
    "ga-29": [["van","suv"],       "outdoor", ["cctv","guard","gate","socket","large","always"], 10.4, 7, 45],
  };
  listings.forEach(l => {
    const m = GARAGE_META[l.id];
    if (!m || l.category !== "garage") return;
    l.vehicles = m[0]; l.parking = m[1]; l.features = m[2];
    l.distanceKm = m[3]; l.addedDaysAgo = m[4];
    // when the space frees up: available-now listings are free from today
    l.freeFromISO = toISO(new Date(today().getTime() + m[5] * 86400000));
  });

  function garageDefaults() {
    return { vehicle: null, parking: null, priceMin: GARAGE_PRICE.min, priceMax: GARAGE_PRICE.max,
             radiusKm: 0, features: [], fromISO: null, toISO: null, nowOnly: false, sort: "rec" };
  }
  /* ---------- Space search (the "Поиск площади" filter page) ----------
     Площадь is rented by the m², so the flow runs the other way round from the
     garage page: the user says what they need to store, that yields a
     recommended area, and the area drives both the price and which listings are
     big enough. `img` items have a photo in images/items/, the rest use icons. */
  const storeItems = [
    { id: "boxes",  label: "Коробки",         unit: "шт.",    m2: 0.3,  img: "boxes" },
    { id: "bike",   label: "Велосипед",       unit: "шт.",    m2: 0.8,  img: "bike" },
    { id: "tyres",  label: "Шины",            unit: "компл.", m2: 0.4,  img: "tyres" },
    { id: "moto",   label: "Мотоцикл",        unit: "шт.",    m2: 2.5,  img: "moto" },
  ];
  const spaceFeatures = [
    { id: "climate",   label: "Климат-контроль",    icon: "snow" },
    { id: "cctv",      label: "Видеонаблюдение",    icon: "cam" },
    { id: "guard",     label: "Охрана",             icon: "shield" },
    { id: "access24",  label: "Доступ 24/7",        icon: "clock" },
    { id: "light",     label: "Освещение",          icon: "bulb" },
    { id: "dry",       label: "Сухое хранение",     icon: "dry" },
    { id: "shelves",   label: "Стеллажи",           icon: "shelf" },
    { id: "socket",    label: "Розетка 220 В",      icon: "plug" },
    { id: "dock",      label: "Погрузочная рампа",  icon: "truck" },
    { id: "ground",    label: "Первый этаж",        icon: "stairs" },
    { id: "lift",      label: "Грузовой лифт",      icon: "lift" },
    { id: "indoor",    label: "В помещении",        icon: "garage" },
    { id: "covered",   label: "Крытое",             icon: "roof" },
    { id: "insurance", label: "Страховка включена", icon: "doc" },
    { id: "ev",        label: "Зарядка электро",    icon: "bolt" },
  ];
  const spaceSortOptions = [
    { id: "rec",    label: "Рекомендуемые" },
    { id: "cheap",  label: "Сначала дешёвые" },
    { id: "pricey", label: "Сначала дорогие" },
    { id: "near",   label: "Ближайшие" },
    { id: "big",    label: "Больше площадь" },
    { id: "rated",  label: "С высоким рейтингом" },
    { id: "new",    label: "Сначала новые" },
  ];
  const SPACE_SIZE = { min: 1, max: 20, step: 0.5 };

  // [features, km from centre, days since listed, free-from offset in days]
  const SPACE_META = {
    "pl-1":  [["cctv","access24","indoor","covered","dry","light","ground"], 1.1, 35, 0],
    "pl-2":  [["climate","cctv","access24","socket","indoor","covered","dry","light","shelves"], 2.3, 18, 0],
    "pl-3":  [["cctv","access24","indoor","covered","dry","light","ground","lift"], 0.6, 9, 0],
    "pl-4":  [["climate","cctv","access24","socket","indoor","covered","dry","light","shelves","dock","insurance"], 5.4, 12, 21],
    "pl-5":  [["cctv","access24","socket","indoor","covered","dry","light","shelves"], 3.2, 26, 0],
    "pl-6":  [["climate","cctv","access24","socket","indoor","covered","dry","light","shelves","lift"], 4.1, 14, 0],
    "pl-7":  [["cctv","access24","indoor","covered","dry","ground"], 2.8, 44, 0],
    "pl-8":  [["cctv","access24","indoor","covered","dry","light","dock","shelves","ground","insurance"], 8.7, 7, 14],
    "pl-9":  [["climate","cctv","access24","indoor","covered","dry","light","lift"], 1.4, 31, 0],
    "pl-10": [["cctv","access24","socket","indoor","covered","dry","light"], 6.2, 22, 0],
    "pl-11": [["cctv","access24","indoor","covered","dry","shelves","ground"], 7.5, 48, 0],
    "pl-12": [["climate","cctv","access24","indoor","covered","dry","light","shelves","dock","insurance"], 9.8, 11, 30],
    "pl-13": [["cctv","access24","indoor","covered","dry","light","lift"], 1.9, 16, 0],
    "pl-14": [["climate","access24","socket","indoor","covered","dry","light","shelves","ev"], 5.1, 5, 0],
    "pl-15": [["cctv","access24","socket","indoor","covered","dry","light","ground"], 3.7, 29, 0],
    "pl-16": [["cctv","access24","indoor","covered","dry","shelves","dock"], 10.3, 38, 0],
    "pl-17": [["cctv","access24","indoor","covered","dry"], 12.6, 52, 0],
    "pl-18": [["climate","cctv","access24","socket","indoor","covered","dry","light","shelves","lift","insurance","ev"], 2.5, 4, 7],
    "pl-19": [["climate","cctv","access24","indoor","covered","dry","light","ground"], 4.6, 20, 0],
    "pl-20": [["cctv","access24","indoor","covered","dry","light","shelves","guard"], 11.2, 33, 0],
    "pl-21": [["cctv","access24","socket","indoor","covered","dry","dock","shelves","guard","ground"], 13.4, 25, 0],
    "pl-22": [["climate","cctv","access24","indoor","covered","dry","light","lift","guard"], 0.9, 6, 0],
    "pl-23": [["cctv","access24","socket","indoor","covered","dry","light","shelves"], 6.8, 41, 0],
    "pl-24": [["climate","cctv","access24","indoor","covered","dry","light","shelves","insurance","guard"], 8.1, 13, 45],
  };
  listings.forEach(l => {
    const m = SPACE_META[l.id];
    if (!m || l.category !== "ploshad") return;
    l.features = m[0]; l.distanceKm = m[1]; l.addedDaysAgo = m[2];
    l.freeFromISO = toISO(new Date(today().getTime() + m[3] * 86400000));
  });

  function spaceDefaults() {
    return { items: {}, sizeM2: 0, sizeTouched: false,
             priceMin: 0, priceMax: 0, priceTouched: false,
             features: [], radiusKm: 0, fromISO: null, toISO: null, nowOnly: false, sort: "rec" };
  }
  /* Rent scales with the area, so a fixed budget slider is meaningless: at 1 m²
     every space costs a few hundred ₽, at 20 m² several thousand. The domain is
     therefore derived from what the qualifying listings would actually cost for
     the chosen area, and re-fitted whenever the area changes. */
  function spacePriceStep(size) {
    if (size <= 2) return 50;
    if (size <= 5) return 100;
    if (size <= 10) return 250;
    return 500;
  }
  function spacePriceDomain(size) {
    const step = spacePriceStep(size);
    const rates = listings.filter(l => l.category === "ploshad" && l.sizeM2 >= size).map(l => l.pricePerM2);
    if (!rates.length) return { min: 0, max: step * 10, step: step };
    const lo = Math.floor(Math.min.apply(null, rates) * size / step) * step;
    const hi = Math.ceil(Math.max.apply(null, rates) * size / step) * step;
    return { min: lo, max: hi > lo ? hi : lo + step, step: step };
  }
  /* The budget window actually in force, derived rather than trusted: a filter
     set straight from spaceDefaults() (or restored from an old session, or set
     programmatically) carries no window yet, and must mean "no limit" — not
     "max 0 ₽", which would filter everything out. */
  function spaceWindow(f, dom) {
    const d = dom || spacePriceDomain(spaceSize(f));
    if (!f.priceTouched) return { lo: d.min, hi: d.max };
    const snap = v => Math.round(v / d.step) * d.step;
    const lo = Math.max(d.min, Math.min(d.max - d.step, snap(f.priceMin)));
    const hi = Math.min(d.max, Math.max(lo + d.step, snap(f.priceMax)));
    return { lo: lo, hi: hi };
  }
  /* Same thing, written back into `f` so the slider inputs show it. */
  function spaceFitPrice(f) {
    const dom = spacePriceDomain(spaceSize(f));
    const win = spaceWindow(f, dom);
    f.priceMin = win.lo; f.priceMax = win.hi;
    return dom;
  }
  /* Straight sum of what was picked, rounded up to the next half-metre. */
  function spaceRecommended(items) {
    let sum = 0;
    storeItems.forEach(it => { const q = items[it.id]; if (q) sum += q * it.m2; });
    if (!sum) return 0;
    return Math.min(SPACE_SIZE.max, Math.max(SPACE_SIZE.min, Math.ceil(sum * 2) / 2));
  }
  /* The size actually searched for: the recommendation until the user drags. */
  function spaceSize(f) {
    if (f.sizeTouched) return f.sizeM2;
    return spaceRecommended(f.items) || SPACE_SIZE.min;
  }
  function spaceMonthly(l, size) { return Math.round(l.pricePerM2 * size); }

  function spaceMatches(l, f, size, dom, win) {
    if (l.category !== "ploshad") return false;
    if (l.sizeM2 < size) return false;                 // must have the area to let
    const d = dom || spacePriceDomain(size), w = win || spaceWindow(f, d);
    const price = spaceMonthly(l, size);
    // a handle parked at the end of its domain means "no bound that side"
    if (w.lo > d.min && price < w.lo) return false;
    if (w.hi < d.max && price > w.hi) return false;
    if (f.radiusKm && l.distanceKm > f.radiusKm) return false;
    if (f.features.length && !f.features.every(x => l.features.indexOf(x) !== -1)) return false;
    if (f.nowOnly && !l.availableNow) return false;
    if (f.fromISO && l.freeFromISO > f.fromISO) return false;
    return true;
  }
  function spaceResults(f, place) {
    const size = spaceSize(f), dom = spacePriceDomain(size), win = spaceWindow(f, dom);
    const out = listings.filter(l => spaceMatches(l, f, size, dom, win) && placeMatches(l, place));
    const by = {
      cheap:  (a, b) => spaceMonthly(a, size) - spaceMonthly(b, size),
      pricey: (a, b) => spaceMonthly(b, size) - spaceMonthly(a, size),
      near:   (a, b) => a.distanceKm - b.distanceKm,
      big:    (a, b) => b.sizeM2 - a.sizeM2,
      rated:  (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      new:    (a, b) => a.addedDaysAgo - b.addedDaysAgo,
      rec:    (a, b) => (b.verified - a.verified) || (b.rating * Math.log10(b.reviews + 10) - a.rating * Math.log10(a.reviews + 10)),
    };
    return out.sort(by[f.sort] || by.rec);
  }
  /* Price distribution across every space that could take this area. */
  function spaceHistogram(buckets, size, dom) {
    const n = buckets || 24, d = dom || spacePriceDomain(size);
    const span = (d.max - d.min) / n;
    const bars = new Array(n).fill(0);
    if (span <= 0) return bars;
    listings.forEach(l => {
      if (l.category !== "ploshad" || l.sizeM2 < size) return;
      const i = Math.min(n - 1, Math.floor((spaceMonthly(l, size) - d.min) / span));
      if (i >= 0) bars[i]++;
    });
    return bars;
  }
  /* Typical monthly cost at this area — shown in the sticky summary. */
  function spaceEstimate(f) {
    const size = spaceSize(f);
    const fits = listings.filter(l => l.category === "ploshad" && l.sizeM2 >= size);
    if (!fits.length) return 0;
    const rates = fits.map(l => l.pricePerM2).sort((a, b) => a - b);
    return Math.round(rates[Math.floor(rates.length / 2)] * size);   // median rate
  }
  function spaceActiveCount(f) {
    if (!f) return 0;
    const d = spaceDefaults();
    let n = f.features.length + Object.keys(f.items).filter(k => f.items[k] > 0).length;
    if (f.radiusKm) n++;
    if (f.nowOnly) n++;
    if (f.priceTouched) n++;
    // dates belong to the search bar, so they are not one of this page's filters
    if (f.sort !== d.sort) n++;
    if (f.sizeTouched) n++;
    return n;
  }

  /* ---------- Склад search (the "Поиск склада" filter page) ----------
     Склад is a whole closed space let per space, so it filters the way the
     garage does — a kind, a heating type, a budget — rather than through the
     m² assistant Площадь uses. The one axis it adds is size: unlike a garage
     (sized by the car that fits) a склад is shopped for by its floor area, so
     that is a range of its own rather than a derived number. */
  const skladTypes = [
    { id: "pantry",   label: "Кладовая",   sub: "До 10 м²",        icon: "door" },
    { id: "basement", label: "Подвал",     sub: "Цокольный этаж",  icon: "stairs" },
    { id: "box",      label: "Бокс",       sub: "Секция на складе", icon: "box" },
    { id: "hall",     label: "Помещение",  sub: "От 20 м²",        icon: "garage" },
  ];
  const heatingTypes = [
    { id: "heated",   label: "Тёплый",        desc: "Отопление круглый год",   icon: "sun" },
    { id: "unheated", label: "Без отопления", desc: "Сухой, но неотапливаемый", icon: "snow" },
  ];
  const skladFeatures = [
    { id: "climate",   label: "Климат-контроль",    icon: "snow" },
    { id: "cctv",      label: "Видеонаблюдение",    icon: "cam" },
    { id: "guard",     label: "Охрана",             icon: "shield" },
    { id: "access24",  label: "Доступ 24/7",        icon: "clock" },
    { id: "light",     label: "Освещение",          icon: "bulb" },
    { id: "dry",       label: "Сухое хранение",     icon: "dry" },
    { id: "shelves",   label: "Стеллажи",           icon: "shelf" },
    { id: "socket",    label: "Розетка 220 В",      icon: "plug" },
    { id: "dock",      label: "Погрузочная рампа",  icon: "truck" },
    { id: "ground",    label: "Первый этаж",        icon: "stairs" },
    { id: "lift",      label: "Грузовой лифт",      icon: "lift" },
    { id: "separate",  label: "Отдельный вход",     icon: "door" },
    { id: "insurance", label: "Страховка включена", icon: "doc" },
  ];
  // rounded outward from the real склад prices (3 600 – 19 800 ₽) and areas (4 – 30 м²)
  const SKLAD_PRICE = { min: 3000, max: 20000, step: 500 };
  const SKLAD_SIZE  = { min: 4, max: 30, step: 1 };

  // [type, heating, features, km from centre, days since listed, free-from offset in days]
  const SKLAD_META = {
    "sk-1":  ["basement", "heated",   ["climate","cctv","access24","dry","light","shelves"], 1.6, 40, 0],
    "sk-2":  ["basement", "heated",   ["cctv","access24","socket","separate","dry","light"], 2.1, 18, 0],
    "sk-3":  ["box",      "heated",   ["climate","cctv","access24","socket","dry","light","ground"], 0.8, 9, 21],
    "sk-4":  ["pantry",   "heated",   ["climate","access24","dry","light"], 3.4, 26, 0],
    "sk-5":  ["hall",     "heated",   ["climate","cctv","access24","guard","dry","light","separate"], 4.2, 12, 0],
    "sk-6":  ["hall",     "unheated", ["cctv","access24","dock","ground","light","shelves","guard"], 8.6, 7, 14],
    "sk-7":  ["pantry",   "heated",   ["climate","access24","dry","light"], 2.7, 44, 0],
    "sk-8":  ["box",      "heated",   ["climate","cctv","access24","socket","dry","light","shelves","lift"], 3.9, 11, 0],
    "sk-9":  ["box",      "unheated", ["cctv","access24","dry","light","ground","shelves"], 1.9, 31, 0],
    "sk-10": ["pantry",   "heated",   ["access24","dry","light"], 5.1, 22, 0],
    "sk-11": ["hall",     "unheated", ["cctv","access24","dock","guard","shelves","ground"], 12.4, 33, 30],
    "sk-12": ["box",      "heated",   ["climate","cctv","access24","dry","light","lift","separate"], 1.2, 6, 0],
    "sk-13": ["basement", "unheated", ["cctv","access24","dry","shelves"], 6.3, 48, 0],
    "sk-14": ["hall",     "unheated", ["cctv","access24","dock","guard","ground","light","shelves","insurance"], 10.8, 14, 45],
    "sk-15": ["pantry",   "heated",   ["climate","access24","dry","light","shelves"], 3.1, 29, 0],
    "sk-16": ["box",      "heated",   ["cctv","access24","socket","dry","light","ground"], 9.2, 20, 0],
    "sk-17": ["pantry",   "heated",   ["climate","cctv","access24","dry","light"], 7.4, 16, 0],
    "sk-18": ["box",      "unheated", ["cctv","access24","dry","shelves","ground","guard"], 7.8, 38, 0],
    "sk-19": ["pantry",   "unheated", ["access24","dry","light"], 4.6, 52, 0],
    "sk-20": ["box",      "heated",   ["climate","cctv","access24","socket","dry","light"], 11.5, 25, 0],
    "sk-21": ["hall",     "heated",   ["climate","cctv","access24","dock","lift","light","shelves","insurance"], 2.4, 4, 7],
    "sk-22": ["pantry",   "heated",   ["climate","cctv","access24","dry","light","separate"], 1.5, 13, 0],
    "sk-23": ["basement", "unheated", ["cctv","access24","dry","light","shelves"], 3.8, 41, 0],
    "sk-24": ["hall",     "unheated", ["cctv","access24","dock","ground","guard","shelves"], 13.1, 35, 0],
    "sk-25": ["basement", "heated",   ["climate","cctv","access24","dry","light","socket"], 6.7, 5, 0],
  };
  listings.forEach(l => {
    const m = SKLAD_META[l.id];
    if (!m || l.category !== "sklad") return;
    l.skladType = m[0]; l.heating = m[1]; l.features = m[2];
    l.distanceKm = m[3]; l.addedDaysAgo = m[4];
    l.freeFromISO = toISO(new Date(today().getTime() + m[5] * 86400000));
  });

  function skladDefaults() {
    return { type: null, heating: null,
             sizeMin: SKLAD_SIZE.min, sizeMax: SKLAD_SIZE.max,
             priceMin: SKLAD_PRICE.min, priceMax: SKLAD_PRICE.max,
             features: [], radiusKm: 0, fromISO: null, toISO: null, nowOnly: false, sort: "rec" };
  }
  function skladActiveCount(f) {
    if (!f) return 0;
    const d = skladDefaults();
    let n = f.features.length;
    if (f.type) n++;
    if (f.heating) n++;
    if (f.sizeMin !== d.sizeMin || f.sizeMax !== d.sizeMax) n++;
    if (f.priceMin !== d.priceMin || f.priceMax !== d.priceMax) n++;
    if (f.radiusKm) n++;
    if (f.nowOnly) n++;
    // dates belong to the search bar, so they are not one of this page's filters
    if (f.sort !== d.sort) n++;
    return n;
  }
  function skladMatches(l, f) {
    if (l.category !== "sklad") return false;
    if (f.type && l.skladType !== f.type) return false;
    if (f.heating && l.heating !== f.heating) return false;
    if (l.sizeM2 < f.sizeMin) return false;
    // the top of each slider means "and above", so don't cap there
    if (f.sizeMax < SKLAD_SIZE.max && l.sizeM2 > f.sizeMax) return false;
    if (l.price < f.priceMin) return false;
    if (f.priceMax < SKLAD_PRICE.max && l.price > f.priceMax) return false;
    if (f.radiusKm && l.distanceKm > f.radiusKm) return false;
    if (f.features.length && !f.features.every(x => l.features.indexOf(x) !== -1)) return false;
    if (f.nowOnly && !l.availableNow) return false;
    // a move-in date only works if the space is free by then
    if (f.fromISO && l.freeFromISO > f.fromISO) return false;
    return true;
  }
  function skladResults(f, place) {
    const out = listings.filter(l => skladMatches(l, f) && placeMatches(l, place));
    const by = {
      cheap:  (a, b) => a.price - b.price,
      pricey: (a, b) => b.price - a.price,
      near:   (a, b) => a.distanceKm - b.distanceKm,
      big:    (a, b) => b.sizeM2 - a.sizeM2,
      rated:  (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      new:    (a, b) => a.addedDaysAgo - b.addedDaysAgo,
      rec:    (a, b) => (b.verified - a.verified) || (b.rating * Math.log10(b.reviews + 10) - a.rating * Math.log10(a.reviews + 10)),
    };
    return out.sort(by[f.sort] || by.rec);
  }
  /* Price histogram behind the slider — one bar per bucket of the domain. */
  function skladHistogram(buckets) {
    const n = buckets || 24, span = (SKLAD_PRICE.max - SKLAD_PRICE.min) / n;
    const bars = new Array(n).fill(0);
    listings.forEach(l => {
      if (l.category !== "sklad") return;
      const i = Math.min(n - 1, Math.max(0, Math.floor((l.price - SKLAD_PRICE.min) / span)));
      bars[i]++;
    });
    return bars;
  }
  /* Same shape as the price histogram, but bucketed by floor area. */
  function skladSizeHistogram(buckets) {
    const n = buckets || 24, span = (SKLAD_SIZE.max - SKLAD_SIZE.min) / n;
    const bars = new Array(n).fill(0);
    listings.forEach(l => {
      if (l.category !== "sklad") return;
      const i = Math.min(n - 1, Math.max(0, Math.floor((l.sizeM2 - SKLAD_SIZE.min) / span)));
      bars[i]++;
    });
    return bars;
  }

  /* How many filters are set — drives the badges on the reset/Фильтры buttons. */
  function garageActiveCount(f) {
    if (!f) return 0;
    const d = garageDefaults();
    let n = f.features.length;
    if (f.vehicle) n++;
    if (f.parking) n++;
    if (f.radiusKm) n++;
    if (f.nowOnly) n++;
    if (f.priceMin !== d.priceMin || f.priceMax !== d.priceMax) n++;
    // dates belong to the search bar, so they are not one of this page's filters
    if (f.sort !== d.sort) n++;
    return n;
  }
  /* Does one garage listing satisfy the filter set? */
  function garageMatches(l, f) {
    if (l.category !== "garage") return false;
    if (f.vehicle && l.vehicles.indexOf(f.vehicle) === -1) return false;
    if (f.parking && l.parking !== f.parking) return false;
    if (l.price < f.priceMin) return false;
    // the top of the slider means "and above", so don't cap there
    if (f.priceMax < GARAGE_PRICE.max && l.price > f.priceMax) return false;
    if (f.radiusKm && l.distanceKm > f.radiusKm) return false;
    if (f.features.length && !f.features.every(x => l.features.indexOf(x) !== -1)) return false;
    if (f.nowOnly && !l.availableNow) return false;
    // a move-in date only works if the space is free by then
    if (f.fromISO && l.freeFromISO > f.fromISO) return false;
    return true;
  }
  const SORTERS = {
    cheap:  (a, b) => a.price - b.price,
    pricey: (a, b) => b.price - a.price,
    near:   (a, b) => a.distanceKm - b.distanceKm,
    rated:  (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    new:    (a, b) => a.addedDaysAgo - b.addedDaysAgo,
    // "Рекомендуемые": verified first, then rating weighted by review count
    rec:    (a, b) => (b.verified - a.verified) || (b.rating * Math.log10(b.reviews + 10) - a.rating * Math.log10(a.reviews + 10)),
  };
  function garageResults(f, place) {
    const out = listings.filter(l => garageMatches(l, f) && placeMatches(l, place));
    return out.sort(SORTERS[f.sort] || SORTERS.rec);
  }
  /* Price histogram behind the slider — one bar per bucket of the domain. */
  function garageHistogram(buckets) {
    const n = buckets || 24, span = (GARAGE_PRICE.max - GARAGE_PRICE.min) / n;
    const bars = new Array(n).fill(0);
    listings.forEach(l => {
      if (l.category !== "garage") return;
      const i = Math.min(n - 1, Math.max(0, Math.floor((l.price - GARAGE_PRICE.min) / span)));
      bars[i]++;
    });
    return bars;
  }

  /* ---------- Places (the "Где" panel) ----------
     Built from the listings themselves so every suggestion returns results. */
  const ANY_PLACE = { id: "any", kind: "any", name: "Рядом", sub: "Показать все места", icon: "nav" };
  const CITY_ICON = { "Москва": "city", "Санкт-Петербург": "bank", "Казань": "home" };
  const places = (function () {
    const out = [ANY_PLACE], byCity = {};
    listings.forEach(l => {
      const c = byCity[l.city] || (byCity[l.city] = { n: 0, d: {} });
      c.n++; c.d[l.district] = (c.d[l.district] || 0) + 1;
    });
    Object.keys(byCity).sort((a, b) => byCity[b].n - byCity[a].n).forEach(city => {
      const c = byCity[city];
      out.push({ id: "c:" + city, kind: "city", name: city, city: city,
                 sub: c.n + " " + placesWord(c.n) + " в городе", icon: CITY_ICON[city] || "city" });
      Object.keys(c.d).sort((a, b) => a.localeCompare(b, "ru")).forEach(d => {
        out.push({ id: "d:" + city + ":" + d, kind: "district", name: d, city: city,
                   sub: city + " · " + c.d[d] + " " + placesWord(c.d[d]), icon: "pinloc" });
      });
    });
    return out;
  })();
  // Shown before the user types anything: "Рядом" + the cities.
  const topPlaces = places.filter(p => p.kind !== "district");
  function matchPlaces(q, limit) {
    q = (q || "").trim().toLowerCase();
    if (!q) return topPlaces;
    const named = places.filter(p => p.kind !== "any");
    const starts = named.filter(p => p.name.toLowerCase().indexOf(q) === 0);
    const rest = named.filter(p => starts.indexOf(p) === -1 && p.name.toLowerCase().indexOf(q) !== -1);
    return starts.concat(rest).slice(0, limit || 6);
  }
  /* Free-text search from the home bar: every word must appear somewhere in the
     listing's name, district or city. */
  function textMatches(l, q) {
    if (!q) return true;
    const hay = (l.title + " " + l.district + " " + l.city).toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.indexOf(w) !== -1);
  }
  function placeMatches(l, p) {
    if (!p || p.kind === "any") return true;
    if (p.kind === "city") return l.city === p.name;
    return l.city === p.city && l.district === p.name;
  }

  /* ---------- Dates (the "Когда" panel) ---------- */
  const MONTHS_NOM = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
  const MONTHS_GEN = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  const MONTHS_ABR = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
  const DOW = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  function pad2(n){ return (n < 10 ? "0" : "") + n; }
  function today(){ const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function toISO(d){ return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function fromISO(s){ const p = String(s || "").split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function isISO(s){ return /^\d{4}-\d{2}-\d{2}$/.test(String(s || "")); }
  function dateShort(iso){ const d = fromISO(iso); return d.getDate() + " " + MONTHS_GEN[d.getMonth()]; }
  function dateLong(iso){ const d = fromISO(iso); return d.getDate() + " " + MONTHS_GEN[d.getMonth()] + " " + d.getFullYear(); }
  /* "6 – 12 авг" inside one month, "6 авг – 12 сен" across two. Abbreviated so
     the range still fits the search pill. */
  function dateRange(a, b){
    if (!b) return dateShort(a);
    const x = fromISO(a), y = fromISO(b);
    if (x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear())
      return x.getDate() + " – " + y.getDate() + " " + MONTHS_ABR[y.getMonth()];
    return x.getDate() + " " + MONTHS_ABR[x.getMonth()] + " – " + y.getDate() + " " + MONTHS_ABR[y.getMonth()];
  }
  function nights(a, b){ return (!a || !b) ? 0 : Math.round((fromISO(b) - fromISO(a)) / 86400000); }

  /* ---------- Geography (for the Yandex map) ----------
     Approximate centre of every city+district pair used above. A listing has no
     address of its own, so its pin is the district centre nudged by its mock
     map.x/y — deterministic, keeps pins from stacking, and stays in the right
     part of town. Keys are "Город|Район" because Кировский/Московский exist in
     more than one city. */
  const CITY_LL = {
    "Москва": [55.7522, 37.6156],
    "Санкт-Петербург": [59.9386, 30.3141],
    "Казань": [55.7963, 49.1088],
  };
  const DISTRICT_LL = {
    "Москва|Арбат": [55.7494, 37.5931],
    "Москва|Аэропорт": [55.8002, 37.5335],
    "Москва|Басманный": [55.7658, 37.6672],
    "Москва|Бутово": [55.5406, 37.5300],
    "Москва|Войковский": [55.8236, 37.4986],
    "Москва|Гагаринский": [55.6903, 37.5636],
    "Москва|Даниловский": [55.7086, 37.6236],
    "Москва|Дорогомилово": [55.7422, 37.5525],
    "Москва|Замоскворечье": [55.7350, 37.6297],
    "Москва|Зюзино": [55.6528, 37.5764],
    "Москва|Крылатское": [55.7561, 37.4139],
    "Москва|Кунцево": [55.7290, 37.4210],
    "Москва|Люблино": [55.6764, 37.7614],
    "Москва|Марьино": [55.6497, 37.7439],
    "Москва|Медведково": [55.8869, 37.6497],
    "Москва|Отрадное": [55.8639, 37.6033],
    "Москва|Пресненский": [55.7614, 37.5697],
    "Москва|Раменки": [55.7010, 37.5060],
    "Москва|Савёловский": [55.7947, 37.5872],
    "Москва|Сокольники": [55.7889, 37.6797],
    "Москва|Строгино": [55.8022, 37.4028],
    "Москва|Таганский": [55.7400, 37.6600],
    "Москва|Тверской": [55.7700, 37.6000],
    "Москва|Хамовники": [55.7300, 37.5800],
    "Москва|Хорошёвский": [55.7789, 37.5292],
    "Москва|Чертаново Южное": [55.6039, 37.6081],
    "Москва|Южнопортовый": [55.7100, 37.6800],
    "Санкт-Петербург|Адмиралтейский": [59.9200, 30.3000],
    "Санкт-Петербург|Василеостровский": [59.9400, 30.2600],
    "Санкт-Петербург|Выборгский": [60.0200, 30.3400],
    "Санкт-Петербург|Калининский": [59.9900, 30.4000],
    "Санкт-Петербург|Кировский": [59.8700, 30.2600],
    "Санкт-Петербург|Красногвардейский": [59.9600, 30.4400],
    "Санкт-Петербург|Красносельский": [59.8400, 30.1700],
    "Санкт-Петербург|Московский": [59.8600, 30.3200],
    "Санкт-Петербург|Невский": [59.8900, 30.4500],
    "Санкт-Петербург|Петроградский": [59.9600, 30.3000],
    "Санкт-Петербург|Приморский": [60.0000, 30.2600],
    "Санкт-Петербург|Фрунзенский": [59.8700, 30.3800],
    "Санкт-Петербург|Центральный": [59.9350, 30.3600],
    "Казань|Авиастроительный": [55.8480, 49.0700],
    "Казань|Вахитовский": [55.7880, 49.1220],
    "Казань|Кировский": [55.8100, 49.0500],
    "Казань|Московский": [55.8250, 49.0900],
    "Казань|Ново-Савиновский": [55.8300, 49.1250],
    "Казань|Приволжский": [55.7500, 49.1800],
    "Казань|Свердловский": [55.7830, 49.1300],
    "Казань|Советский": [55.7900, 49.2100],
  };
  /* [lat, lng] for a listing — district centre ±~700 m from its mock position */
  function listingLL(l) {
    const c = DISTRICT_LL[l.city + "|" + l.district] || CITY_LL[l.city] || CITY_LL["Москва"];
    const m = l.map || { x: 50, y: 50 };
    return [c[0] + (50 - m.y) * 0.00013, c[1] + (m.x - 50) * 0.00022];
  }
  /* Yandex v3 wants [lng, lat] */
  function listingLngLat(l) { const p = listingLL(l); return [p[1], p[0]]; }
  function cityLL(name) { return CITY_LL[name] || CITY_LL["Москва"]; }

  Q.data = { categories, amenities, districts, listings, monthly, priceLabel, fmt, placesWord, garagesWord,
             vehicleTypes, parkingTypes, garageFeatures, radiusOptions, sortOptions, GARAGE_PRICE,
             garageDefaults, garageMatches, garageResults, garageHistogram, garageActiveCount,
             storeItems, spaceFeatures, spaceSortOptions, SPACE_SIZE,
             spaceDefaults, spaceRecommended, spaceSize, spaceMonthly, spaceMatches,
             spacePriceDomain, spaceWindow, spaceFitPrice, spaceResults, spaceHistogram,
             spaceEstimate, spaceActiveCount,
             skladTypes, heatingTypes, skladFeatures, SKLAD_PRICE, SKLAD_SIZE,
             skladDefaults, skladMatches, skladResults, skladHistogram, skladSizeHistogram,
             skladActiveCount,
             places, topPlaces, matchPlaces, placeMatches, textMatches, ANY_PLACE,
             MONTHS_NOM, MONTHS_GEN, MONTHS_ABR, DOW, today, toISO, fromISO, isISO,
             dateShort, dateLong, dateRange, nights,
             listingLL, listingLngLat, cityLL };
})(window.Q = window.Q || {});
