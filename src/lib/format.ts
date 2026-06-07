export function formatBRL(value: number | string): string {
  const num = Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  return `R$ ${num.toFixed(2).replace('.', ',')}`
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 13) {
    // +55 11 9 8765 4321
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }
  return phone
}
