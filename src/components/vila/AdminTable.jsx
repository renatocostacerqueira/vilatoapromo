import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Check, RotateCcw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const statusStyle = {
  emitido: 'bg-toa-sage/10 text-toa-sage',
  utilizado: 'bg-toa-gold/15 text-toa-gold'
};

const buildWhatsAppUrl = (voucher) => {
  const firstName = (voucher.full_name || '').trim().split(' ')[0] || '';
  const message =
    `Olá, ${firstName}! Aqui é da Vila Toá. ` +
    `Vimos que você resgatou seu vale-presente de R$150,00. ` +
    `Seu código é *${voucher.code}* — guarde-o, pois será necessário no momento da reserva. ` +
    `Queremos te ajudar com sua experiência.`;
  const digits = (voucher.phone || '').replace(/\D/g, '');
  const fullNumber = digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
};

export default function AdminTable({ vouchers, loading, onStatusChange, onDelete }) {
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
              <Th>E-mail</Th>
              <Th>WhatsApp</Th>
              <Th>Data</Th>
              <Th>Código</Th>
              <Th>Status</Th>
              <Th className="text-right">Ações</Th>
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
                </Td>
                <Td>
                  <p className="text-toa-ink">{v.phone}</p>
                </Td>
                <Td>
                  <p className="text-xs text-toa-ink/70">
                    {format(new Date(v.created_date), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-xs text-toa-ink/50">
                    {format(new Date(v.created_date), 'HH:mm')}
                  </p>
                </Td>
                <Td>
                  <span className="font-serif tracking-wider text-toa-bark">{v.code}</span>
                </Td>
                <Td>
                  <span className={`inline-block text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle[v.status] || ''}`}>
                    {v.status}
                  </span>
                </Td>
                <Td>
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={buildWhatsAppUrl(v)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Enviar mensagem no WhatsApp"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-toa-sage/10 text-toa-sage hover:bg-toa-sage hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    {v.status === 'emitido' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onStatusChange(v, 'utilizado')}
                        className="h-9 rounded-full text-xs text-toa-bark hover:bg-toa-bark/5 px-3"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Marcar utilizado
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onStatusChange(v, 'emitido')}
                        className="h-9 rounded-full text-xs text-toa-ink/60 hover:bg-toa-ink/5 px-3"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Reverter
                      </Button>
                    )}
                    <button
                      onClick={() => onDelete(v)}
                      title="Excluir cadastro"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle[v.status] || ''}`}>
                {v.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-toa-gold/10">
              <span className="font-serif tracking-wider text-sm text-toa-bark">{v.code}</span>
              <span className="text-[11px] text-toa-ink/50">
                {format(new Date(v.created_date), 'dd/MM/yy HH:mm')}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={buildWhatsAppUrl(v)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-full bg-toa-sage/10 text-toa-sage text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              {v.status === 'emitido' ? (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(v, 'utilizado')}
                  className="flex-1 h-10 rounded-full bg-toa-bark hover:bg-toa-bark/90 text-toa-sand text-xs uppercase tracking-wider"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Utilizado
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(v, 'emitido')}
                  className="flex-1 h-10 rounded-full text-xs uppercase tracking-wider"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reverter
                </Button>
              )}
              <button
                onClick={() => onDelete(v)}
                title="Excluir cadastro"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-destructive/70 bg-destructive/5 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Th({ children, className = '' }) {
  return (
    <th className={`px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-toa-ink/60 font-medium ${className}`}>
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-5 py-4 align-top">{children}</td>;
}