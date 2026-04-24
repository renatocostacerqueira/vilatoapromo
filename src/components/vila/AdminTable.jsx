import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const statusStyle = {
  emitido: 'bg-toa-sage/10 text-toa-sage',
  resgatado: 'bg-toa-gold/15 text-toa-gold',
  expirado: 'bg-toa-ink/10 text-toa-ink/70'
};

export default function AdminTable({ vouchers, loading, onStatusChange }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border border-toa-gold/10">
        <div className="w-6 h-6 border-2 border-toa-gold/30 border-t-toa-gold rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border border-toa-gold/10">
        <p className="font-serif text-xl text-toa-bark mb-1">Nenhum cadastro</p>
        <p className="text-sm text-toa-ink/60 font-light">Não há registros com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-toa-gold/10 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-toa-sand/60">
            <tr className="text-left">
              <Th>Nome</Th>
              <Th>Contato</Th>
              <Th>Presenteado</Th>
              <Th>Código</Th>
              <Th>Status</Th>
              <Th>Data</Th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-t border-toa-gold/10 hover:bg-toa-sand/40 transition-colors">
                <Td>
                  <p className="font-medium text-toa-bark">{v.full_name}</p>
                </Td>
                <Td>
                  <p className="text-toa-ink">{v.email}</p>
                  <p className="text-xs text-toa-ink/60">{v.phone}</p>
                </Td>
                <Td>
                  <p className="text-toa-ink">{v.recipient_name || '—'}</p>
                </Td>
                <Td>
                  <span className="font-serif tracking-wider text-toa-bark">{v.code}</span>
                </Td>
                <Td>
                  <StatusSelect value={v.status} onChange={(s) => onStatusChange(v, s)} />
                </Td>
                <Td>
                  <p className="text-xs text-toa-ink/70">
                    {format(new Date(v.created_date), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-xs text-toa-ink/50">
                    {format(new Date(v.created_date), 'HH:mm')}
                  </p>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden divide-y divide-toa-gold/10">
        {vouchers.map((v) => (
          <div key={v.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-toa-bark truncate">{v.full_name}</p>
                <p className="text-xs text-toa-ink/70 truncate">{v.email}</p>
                <p className="text-xs text-toa-ink/60">{v.phone}</p>
              </div>
              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle[v.status] || ''}`}>
                {v.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-toa-gold/10">
              <span className="font-serif tracking-wider text-sm text-toa-bark">{v.code}</span>
              <span className="text-[11px] text-toa-ink/50">
                {format(new Date(v.created_date), 'dd/MM/yy HH:mm')}
              </span>
            </div>
            {v.recipient_name && (
              <p className="text-xs text-toa-ink/60">Para: {v.recipient_name}</p>
            )}
            <StatusSelect value={v.status} onChange={(s) => onStatusChange(v, s)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-toa-ink/60 font-medium">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-5 py-4 align-top">{children}</td>;
}

function StatusSelect({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-8 w-32 rounded-full border-0 text-xs font-medium ${statusStyle[value] || ''}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="emitido">Emitido</SelectItem>
        <SelectItem value="resgatado">Resgatado</SelectItem>
        <SelectItem value="expirado">Expirado</SelectItem>
      </SelectContent>
    </Select>
  );
}