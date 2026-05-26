export const normalizeRut = (value: string): string => {
  const raw = String(value || '').replace(/[^0-9kK]/g, '').toUpperCase()
  if (raw.length < 2) return ''
  return `${raw.slice(0, -1)}${raw.slice(-1)}`
}

export const formatRut = (value: string): string => {
  const normalized = normalizeRut(value)
  if (normalized.length < 2) return ''
  const body = normalized.slice(0, -1)
  const dv = normalized.slice(-1)
  const grouped = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${grouped}-${dv}`
}

const calculateDv = (body: string): string => {
  let factor = 2
  let total = 0
  for (let i = body.length - 1; i >= 0; i -= 1) {
    total += Number(body[i]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const remainder = 11 - (total % 11)
  if (remainder === 11) return '0'
  if (remainder === 10) return 'K'
  return String(remainder)
}

export const isValidRut = (value: string): boolean => {
  const normalized = normalizeRut(value)
  if (normalized.length < 2) return false
  const body = normalized.slice(0, -1)
  const dv = normalized.slice(-1)
  if (!/^\d{7,8}$/.test(body)) return false
  return calculateDv(body) === dv
}
