import React from 'react';
import Ornament from './Ornament';

export default function VoucherCard({ code }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_12px_48px_rgba(54,40,34,0.12)] overflow-hidden border border-toa-gold/15">
      <div className="p-8 md:p-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-toa-gold font-medium mb-5">
          Vale-Presente Vila Toá
        </p>

        <Ornament />

        <div className="mt-6 mb-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-toa-ink/60 mb-1">Valor</p>
          <p className="font-serif text-4xl md:text-5xl text-toa-bark">
            R$ 150<span className="text-2xl text-toa-ink/60">,00</span>
          </p>
        </div>

        <div className="mt-6 bg-toa-sand rounded-2xl p-6 border border-dashed border-toa-gold/40">
          <p className="text-[10px] uppercase tracking-[0.3em] text-toa-ink/60 mb-2">
            Código
          </p>
          <p className="font-serif text-xl md:text-2xl text-toa-bark tracking-[0.15em] select-all break-all">
            {code}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-toa-ink/70">
          <span className="uppercase tracking-[0.25em]">Validade</span>
          <span className="h-px w-6 bg-toa-gold/40" />
          <span className="font-serif text-toa-bark">31/12/2026</span>
        </div>
      </div>

      <div className="bg-toa-bark px-8 py-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-toa-gold">Vila Toá</p>
        <p className="text-[11px] text-toa-sand/60 mt-0.5 font-light">
          Natureza · Pausa · Presença
        </p>
      </div>
    </div>
  );
}