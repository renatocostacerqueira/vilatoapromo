import React from 'react';

const rules = [
  'Voucher de R$ 150,00 para desconto em hospedagem',
  'Uso condicionado à apresentação do código',
  'Válido até 31/12/2026',
  'Pode haver restrição de diárias',
  'Válido para 1 uso',
  'Apenas reservas diretas com a Vila Toá',
  'Não cumulativo',
  'Não convertível em dinheiro'
];

export default function VoucherRules() {
  return (
    <div className="mt-10 bg-white/60 rounded-2xl border border-toa-gold/15 p-6 md:p-7">
      <p className="text-[10px] uppercase tracking-[0.35em] text-toa-gold font-medium text-center mb-5">
        Regulamento
      </p>
      <ul className="space-y-2.5">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-3 text-[13px] text-toa-ink/80 font-light leading-relaxed">
            <span className="mt-[7px] w-1 h-1 rounded-full bg-toa-gold flex-shrink-0" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}