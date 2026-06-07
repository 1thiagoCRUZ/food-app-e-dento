import { Pencil, Trash2, Percent, DollarSign, Truck } from 'lucide-react'
import type { Coupon } from '../../../data/mock'
import { formatBRL } from '../../../lib/format'

interface CouponTableProps {
  coupons: Coupon[]
  onToggleStatus: (id: number) => void
}

const typeIcon: Record<string, any> = {
  percent: Percent,
  fixed: DollarSign,
  shipping: Truck,
}

export function CouponTable({ coupons, onToggleStatus }: CouponTableProps) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Desconto</th>
            <th>Pedido mínimo</th>
            <th>Usos</th>
            <th>Validade</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(c => {
            const Icon = typeIcon[c.type] || Percent
            const usedPct = (c.uses / c.limit) * 100
            const expired = new Date(c.expiresAt).getTime() < Date.now()
            return (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-12">
                    <div className="stat-icon" style={{ width: 36, height: 36, background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-md fw-700 text-dark" style={{ letterSpacing: 0.5 }}>{c.code}</div>
                      <div className="text-xs text-muted">
                        {c.type === 'percent' && 'Percentual'}
                        {c.type === 'fixed' && 'Valor fixo'}
                        {c.type === 'shipping' && 'Frete grátis'}
                      </div>
                    </div>
                  </div>
                </td>
                <td><span className="fw-700 text-dark">{c.value}</span></td>
                <td>{formatBRL(c.min)}</td>
                <td>
                  <div style={{ minWidth: 140 }}>
                    <div className="flex justify-between text-xs text-muted" style={{ marginBottom: 4 }}>
                      <span>{c.uses}</span>
                      <span>de {c.limit}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${Math.min(usedPct, 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td>
                  {expired ? (
                    <span className="pill pill-danger">Expirado</span>
                  ) : (
                    <span style={{ color: 'var(--text-dark)' }}>{new Date(c.expiresAt).toLocaleDateString()}</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-8">
                    <div
                      className={`switch ${c.isActive ? 'on' : ''}`}
                      onClick={() => onToggleStatus(c.id)}
                    />
                    <span className={`pill ${c.isActive ? 'pill-success' : 'pill-neutral'}`}>
                      <span className="pill-dot" />
                      {c.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon" title="Editar"><Pencil size={16} /></button>
                  <button className="btn-icon" title="Remover"><Trash2 size={16} /></button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
