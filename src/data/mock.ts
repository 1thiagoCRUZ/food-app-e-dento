export type OrderStatus = 'new' | 'preparing' | 'ready' | 'shipping'

export const store = {
  name: 'Pizzaria Roma',
  tagline: 'Cantina italiana',
  photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
  cover: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=1200&h=400&fit=crop',
  address: 'R. Augusta, 1200 — Consolação',
  rating: 4.7,
  reviews: 1284,
}

export interface OrderItem {
  q: number
  name: string
  price: number
  notes?: string
}

export interface Order {
  id: string
  time: string
  placedAt: string
  customer: {
    name: string
    phone: string
    address: string
    complement?: string
    reference?: string
    notes?: string
    distanceKm?: number
    isFirstOrder?: boolean
  }
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount?: number
  couponCode?: string
  total: number
  payment: string
  paymentType: 'pix' | 'card_credit' | 'card_debit' | 'cash' | 'meal_voucher'
  paid: boolean
  changeFor?: number
  status: OrderStatus
  pickupCode: string
  prepTimeMin: number
  driver?: {
    name: string
    initials: string
    vehicle: string
    plate: string
    phone: string
    rating: number
  }
}

export const orders: Order[] = [
  {
    id: 'ORD-1042',
    time: '14:32',
    placedAt: 'Hoje, 14:32',
    customer: {
      name: 'Ana Silva',
      phone: '+5511987654321',
      address: 'Rua das Flores, 123 — Centro',
      complement: 'Apto 502, interfone 502B',
      reference: 'Próximo à padaria Estrela',
      notes: 'Tirar a cebola da pizza, por favor.',
      distanceKm: 1.8,
    },
    items: [
      { q: 2, name: 'Pizza Margherita G', price: 39.90 },
      { q: 1, name: 'Coca-Cola 2L', price: 12.90 },
    ],
    subtotal: 92.70,
    deliveryFee: 8.90,
    total: 101.60,
    payment: 'Pix',
    paymentType: 'pix',
    paid: true,
    status: 'new',
    pickupCode: '4827',
    prepTimeMin: 30,
  },
  {
    id: 'ORD-1043',
    time: '14:28',
    placedAt: 'Hoje, 14:28',
    customer: {
      name: 'Carlos Souza',
      phone: '+5511976543210',
      address: 'Av. Paulista, 1500 — Bela Vista',
      complement: 'Bloco A, casa 12',
      distanceKm: 2.4,
      isFirstOrder: true,
    },
    items: [
      { q: 1, name: 'Smash Burger Duplo', price: 32.90, notes: 'Sem picles' },
      { q: 1, name: 'Batata rústica grande', price: 18.00 },
    ],
    subtotal: 50.90,
    deliveryFee: 7.90,
    discount: 13.20,
    couponCode: 'BURGER20',
    total: 45.60,
    payment: 'Cartão · Crédito',
    paymentType: 'card_credit',
    paid: true,
    status: 'new',
    pickupCode: '7193',
    prepTimeMin: 25,
  },
  {
    id: 'ORD-1041',
    time: '14:15',
    placedAt: 'Hoje, 14:15',
    customer: {
      name: 'Maria Santos',
      phone: '+5511965432109',
      address: 'Rua Oscar Freire, 200 — Jardins',
      complement: '4º andar',
      distanceKm: 3.1,
    },
    items: [
      { q: 1, name: 'Combo Sushi 20 peças', price: 69.90 },
      { q: 1, name: 'Hot Roll 8un', price: 32.00 },
    ],
    subtotal: 101.90,
    deliveryFee: 9.90,
    total: 111.80,
    payment: 'Cartão · Débito',
    paymentType: 'card_debit',
    paid: true,
    status: 'preparing',
    pickupCode: '5582',
    prepTimeMin: 40,
  },
  {
    id: 'ORD-1040',
    time: '14:02',
    placedAt: 'Hoje, 14:02',
    customer: {
      name: 'Pedro Lima',
      phone: '+5511954321098',
      address: 'Rua Augusta, 800 — Consolação',
      reference: 'Portão azul ao lado da farmácia',
      distanceKm: 1.2,
      notes: 'Ligar antes de subir.',
    },
    items: [
      { q: 1, name: 'Pizza Calabresa G', price: 42.90 },
      { q: 1, name: 'Borda recheada', price: 8.00 },
    ],
    subtotal: 50.90,
    deliveryFee: 7.90,
    total: 58.80,
    payment: 'Dinheiro',
    paymentType: 'cash',
    paid: false,
    changeFor: 100,
    status: 'preparing',
    pickupCode: '3041',
    prepTimeMin: 30,
  },
  {
    id: 'ORD-1039',
    time: '13:50',
    placedAt: 'Hoje, 13:50',
    customer: {
      name: 'Fernanda Costa',
      phone: '+5511943210987',
      address: 'Alameda Santos, 700 — Cerqueira César',
      complement: 'Casa, portão verde',
      distanceKm: 2.0,
    },
    items: [
      { q: 3, name: 'Brownie com Sorvete', price: 22.90, notes: 'Bem quente no chocolate' },
    ],
    subtotal: 68.70,
    deliveryFee: 6.90,
    total: 75.60,
    payment: 'Pix',
    paymentType: 'pix',
    paid: true,
    status: 'ready',
    pickupCode: '9201',
    prepTimeMin: 15,
    driver: {
      name: 'Lucas Pereira',
      initials: 'LP',
      vehicle: 'Moto Yamaha Factor',
      plate: 'DEF-2G45',
      phone: '+5511977776666',
      rating: 4.8,
    },
  },
  {
    id: 'ORD-1038',
    time: '13:42',
    placedAt: 'Hoje, 13:42',
    customer: {
      name: 'João Albuquerque',
      phone: '+5511932109876',
      address: 'Rua Bela Cintra, 450 — Consolação',
      complement: 'Sala 1204 — pedir na recepção',
      distanceKm: 1.6,
    },
    items: [
      { q: 1, name: 'Pizza Margherita G', price: 39.90 },
      { q: 2, name: 'Refrigerante lata', price: 7.00 },
    ],
    subtotal: 53.90,
    deliveryFee: 8.90,
    total: 62.80,
    payment: 'Cartão · Crédito',
    paymentType: 'card_credit',
    paid: true,
    status: 'shipping',
    pickupCode: '6634',
    prepTimeMin: 25,
    driver: {
      name: 'Rafael M.',
      initials: 'RM',
      vehicle: 'Moto Honda CG 160',
      plate: 'ABC-1D23',
      phone: '+5511988887777',
      rating: 4.9,
    },
  },
]

export type DeliveryStage = 'going_to_pickup' | 'at_pickup' | 'going_to_drop' | 'at_drop'

export interface Driver {
  id: string
  name: string
  initials: string
  vehicle: string
  plate: string
  phone: string
  rating: number
  totalDeliveries: number
  status: 'available' | 'busy' | 'offline'
  distanceKm?: number
  currentOrderId?: string
  deliveryStage?: DeliveryStage
  etaMin?: number
}

export const drivers: Driver[] = [
  { id: 'D-01', name: 'Rafael Moreira', initials: 'RM', vehicle: 'Moto Honda CG 160', plate: 'ABC-1D23', phone: '+5511988887777', rating: 4.9, totalDeliveries: 1842, status: 'busy', currentOrderId: 'ORD-1038', deliveryStage: 'going_to_drop', etaMin: 8 },
  { id: 'D-02', name: 'Lucas Pereira', initials: 'LP', vehicle: 'Moto Yamaha Factor', plate: 'DEF-2G45', phone: '+5511977776666', rating: 4.8, totalDeliveries: 921, status: 'busy', currentOrderId: 'ORD-1039', deliveryStage: 'going_to_pickup', etaMin: 4 },
  { id: 'D-03', name: 'Beatriz Almeida', initials: 'BA', vehicle: 'Bike elétrica', plate: '—', phone: '+5511966665555', rating: 4.95, totalDeliveries: 412, status: 'available', distanceKm: 1.1 },
  { id: 'D-04', name: 'Diego Castro', initials: 'DC', vehicle: 'Moto Honda Biz', plate: 'GHI-3J67', phone: '+5511955554444', rating: 4.7, totalDeliveries: 1303, status: 'available', distanceKm: 1.8 },
  { id: 'D-05', name: 'Camila Rocha', initials: 'CR', vehicle: 'Carro Fiat Mobi', plate: 'JKL-4M89', phone: '+5511944443333', rating: 4.85, totalDeliveries: 678, status: 'offline' },
]

export interface Product {
  id: number
  name: string
  desc: string
  category: string
  price: number
  image: string
  stock: number
  available: boolean
  sold30d: number
}

export const products: Product[] = [
  { id: 1, name: 'Pizza Margherita', desc: 'Molho de tomate, mussarela fresca, manjericão e azeite extra virgem.', category: 'Pizzas', price: 39.90, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=100&h=100&fit=crop', stock: 24, available: true, sold30d: 142 },
  { id: 2, name: 'Pizza Calabresa', desc: 'Calabresa fatiada, cebola roxa, azeitonas e orégano.', category: 'Pizzas', price: 42.90, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop', stock: 18, available: true, sold30d: 98 },
  { id: 3, name: 'Smash Burger Duplo', desc: 'Dois smash de blend bovino, cheddar, alface, tomate e molho especial.', category: 'Hambúrgueres', price: 32.90, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop', stock: 32, available: true, sold30d: 187 },
  { id: 4, name: 'Combo Sushi 20 peças', desc: '10 hot rolls, 5 uramaki e 5 niguiris variados.', category: 'Japonesa', price: 69.90, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop', stock: 0, available: false, sold30d: 64 },
  { id: 5, name: 'Brownie com Sorvete', desc: 'Brownie de chocolate belga com sorvete de baunilha e calda quente.', category: 'Sobremesas', price: 22.90, image: 'https://images.unsplash.com/photo-1564353009664-de5a49479e0f?w=100&h=100&fit=crop', stock: 15, available: true, sold30d: 89 },
  { id: 6, name: 'Coca-Cola 2L', desc: 'Garrafa pet gelada.', category: 'Bebidas', price: 12.90, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=100&h=100&fit=crop', stock: 48, available: true, sold30d: 215 },
]

export interface Coupon {
  id: number
  code: string
  type: 'percent' | 'fixed' | 'shipping'
  value: string
  min: number
  uses: number
  limit: number
  expiresAt: string
  isActive: boolean
}

export const coupons: Coupon[] = [
  { id: 1, code: 'NOVO30', type: 'percent', value: '30%', min: 30, uses: 156, limit: 500, expiresAt: '2026-08-30', isActive: true },
  { id: 2, code: 'FRETEGRATIS', type: 'shipping', value: 'Frete grátis', min: 50, uses: 89, limit: 200, expiresAt: '2026-07-15', isActive: true },
  { id: 3, code: 'BURGER20', type: 'percent', value: '20%', min: 40, uses: 47, limit: 100, expiresAt: '2026-06-30', isActive: true },
  { id: 4, code: 'VOLTA10', type: 'fixed', value: 'R$ 10,00', min: 40, uses: 234, limit: 250, expiresAt: '2026-04-01', isActive: false },
]

export const hourlyOrders = [
  { hour: '10h', count: 4 },
  { hour: '11h', count: 12 },
  { hour: '12h', count: 28, peak: true },
  { hour: '13h', count: 22 },
  { hour: '14h', count: 18 },
  { hour: '15h', count: 9 },
  { hour: '16h', count: 7 },
  { hour: '17h', count: 11 },
  { hour: '18h', count: 16 },
  { hour: '19h', count: 24, peak: true },
  { hour: '20h', count: 19 },
  { hour: '21h', count: 8 },
]

export const topProducts = [
  { name: 'Smash Burger Duplo', count: 187, revenue: 6152.30 },
  { name: 'Pizza Margherita', count: 142, revenue: 5665.80 },
  { name: 'Coca-Cola 2L', count: 215, revenue: 2773.50 },
  { name: 'Pizza Calabresa', count: 98, revenue: 4204.20 },
  { name: 'Brownie com Sorvete', count: 89, revenue: 2038.10 },
]
