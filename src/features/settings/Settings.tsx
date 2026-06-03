import { useState } from 'react'
import { Store, Clock, CreditCard, Bell, Truck } from 'lucide-react'

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

export function Settings() {
  const [autoAccept, setAutoAccept] = useState(false)
  const [printOnNew, setPrintOnNew] = useState(true)
  const [soundAlert, setSoundAlert] = useState(true)
  const [hours, setHours] = useState(
    days.map(d => ({ day: d, open: '11:00', close: '23:00', enabled: d !== 'Domingo' }))
  )

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Configurações</h1>
          <p className="page-subtitle">Informações da loja, horários e preferências operacionais.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SectionCard icon={Store} title="Dados da loja" desc="Informações exibidas para clientes">
          <div className="field">
            <label>Nome da loja</label>
            <input className="input" defaultValue="Pizzaria Roma" />
          </div>
          <div className="field">
            <label>CNPJ</label>
            <input className="input" defaultValue="12.345.678/0001-90" />
          </div>
          <div className="field">
            <label>Endereço</label>
            <input className="input" defaultValue="R. Augusta, 1200 — Consolação, SP" />
          </div>
          <div className="row">
            <div className="field">
              <label>Telefone</label>
              <input className="input" defaultValue="(11) 99999-0000" />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input className="input" defaultValue="contato@pizzariaroma.com" />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Clock} title="Horários de funcionamento" desc="Quando a loja recebe pedidos">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hours.map((h, i) => (
              <div key={h.day} className="flex items-center gap-12" style={{ padding: '6px 0', borderBottom: i < hours.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                <div
                  className={`switch ${h.enabled ? 'on' : ''}`}
                  onClick={() => setHours(prev => prev.map((x, idx) => idx === i ? { ...x, enabled: !x.enabled } : x))}
                />
                <div className="text-md fw-600 text-dark" style={{ width: 80 }}>{h.day}</div>
                {h.enabled ? (
                  <div className="flex items-center gap-8" style={{ flex: 1 }}>
                    <input className="input" defaultValue={h.open} style={{ width: 90, padding: '6px 10px' }} />
                    <span className="text-muted">até</span>
                    <input className="input" defaultValue={h.close} style={{ width: 90, padding: '6px 10px' }} />
                  </div>
                ) : (
                  <span className="text-sm text-muted" style={{ flex: 1 }}>Fechado</span>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={Truck} title="Entrega" desc="Taxas, raio e tempo">
          <div className="row">
            <div className="field">
              <label>Raio de entrega (km)</label>
              <input className="input" defaultValue="5" />
            </div>
            <div className="field">
              <label>Tempo estimado (min)</label>
              <input className="input" defaultValue="35-50" />
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label>Taxa base (R$)</label>
              <input className="input" defaultValue="6,90" />
            </div>
            <div className="field">
              <label>Taxa por km adicional</label>
              <input className="input" defaultValue="1,50" />
            </div>
          </div>
          <div className="field">
            <label>Pedido mínimo para entrega</label>
            <input className="input" defaultValue="R$ 25,00" />
          </div>
        </SectionCard>

        <SectionCard icon={CreditCard} title="Pagamentos aceitos" desc="Métodos disponíveis no checkout">
          <ToggleRow label="Pix" defaultOn />
          <ToggleRow label="Cartão de crédito" defaultOn />
          <ToggleRow label="Cartão de débito" defaultOn />
          <ToggleRow label="Dinheiro (pagar na entrega)" defaultOn />
          <ToggleRow label="VR / VA" />
        </SectionCard>

        <SectionCard icon={Bell} title="Notificações e operação" desc="Como reagir a novos pedidos" wide>
          <ToggleRow
            label="Aceitar pedidos automaticamente"
            sub="Pula a etapa Novos pedidos quando habilitado"
            value={autoAccept}
            onChange={() => setAutoAccept(!autoAccept)}
          />
          <ToggleRow
            label="Imprimir comanda em pedidos novos"
            sub="Envia direto à impressora térmica configurada"
            value={printOnNew}
            onChange={() => setPrintOnNew(!printOnNew)}
          />
          <ToggleRow
            label="Som ao chegar pedido"
            sub="Alerta sonoro no painel"
            value={soundAlert}
            onChange={() => setSoundAlert(!soundAlert)}
          />
        </SectionCard>
      </div>

      <div className="flex justify-between items-center" style={{ marginTop: 24 }}>
        <button className="btn btn-ghost">Cancelar</button>
        <button className="btn btn-primary">Salvar alterações</button>
      </div>
    </>
  )
}

function SectionCard({ icon: Icon, title, desc, children, wide }: { icon: any; title: string; desc: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="card card-pad-lg" style={wide ? { gridColumn: 'span 2' } : undefined}>
      <div className="flex items-center gap-12 mb-16">
        <div className="stat-icon" style={{ width: 38, height: 38, background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-lg fw-700 text-dark">{title}</div>
          <div className="text-xs text-muted">{desc}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  )
}

function ToggleRow({ label, sub, defaultOn, value, onChange }: { label: string; sub?: string; defaultOn?: boolean; value?: boolean; onChange?: () => void }) {
  const [on, setOn] = useState(defaultOn ?? false)
  const isOn = value !== undefined ? value : on
  const handle = () => onChange ? onChange() : setOn(!on)
  return (
    <div className="flex items-center gap-12" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ flex: 1 }}>
        <div className="text-md fw-600 text-dark">{label}</div>
        {sub && <div className="text-xs text-muted" style={{ marginTop: 2 }}>{sub}</div>}
      </div>
      <div className={`switch ${isOn ? 'on' : ''}`} onClick={handle} />
    </div>
  )
}
