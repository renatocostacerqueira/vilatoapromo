import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/vila/Logo';
import Ornament from '@/components/vila/Ornament';

export default function Voucher() {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await base44.entities.GiftVoucher.filter({ id });
      setVoucher(list[0] || null);
      setLoading(false);
    })();
  }, [id]);

  const handleCopy = () => {
    if (!voucher) return;
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-toa-sand flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-toa-gold/30 border-t-toa-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-toa-sand flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-serif text-2xl text-toa-bark mb-3">Vale não encontrado</h1>
          <Link to="/" className="text-toa-gold underline text-sm">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-toa-sand">
      {/* Top image */}
      <div className="relative h-[35vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#362822]/30 via-[#362822]/10 to-[#F7F4EF]" />
        <div className="relative h-full flex items-center justify-center">
          <Logo variant="light" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="px-6 pb-20 -mt-20 relative z-10"
      >
        <div className="max-w-md mx-auto">
          {/* Voucher card */}
          <div className="bg-white rounded-[2rem] shadow-[0_12px_48px_rgba(54,40,34,0.1)] overflow-hidden border border-toa-gold/10">
            <div className="p-8 md:p-10 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-toa-gold font-medium mb-6">
                Vale-Presente
              </p>

              <h1 className="font-serif text-3xl md:text-4xl text-toa-bark leading-tight">
                Para
              </h1>
              <p className="font-serif italic text-3xl md:text-4xl text-toa-gold mt-1 mb-6">
                {voucher.recipient_name || voucher.full_name}
              </p>

              <Ornament />

              <p className="text-sm text-toa-ink/70 font-light mt-6 mb-8 leading-relaxed px-2">
                Uma experiência cuidadosamente preparada
                para um momento de reconexão.
              </p>

              {/* Code */}
              <div className="bg-toa-sand rounded-2xl p-6 border border-dashed border-toa-gold/40">
                <p className="text-[10px] uppercase tracking-[0.3em] text-toa-ink/60 mb-2">
                  Código de resgate
                </p>
                <p className="font-serif text-2xl md:text-3xl text-toa-bark tracking-widest select-all">
                  {voucher.code}
                </p>
              </div>

              <Button
                onClick={handleCopy}
                variant="ghost"
                className="mt-4 text-toa-sage hover:text-toa-sage hover:bg-toa-sage/5 rounded-full text-xs tracking-wider uppercase h-10"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copiado' : 'Copiar código'}
              </Button>
            </div>

            {/* Footer strip */}
            <div className="bg-toa-bark px-8 py-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.35em] text-toa-gold">
                Vila Toá
              </p>
              <p className="text-[11px] text-toa-sand/60 mt-1 font-light">
                Natureza · Pausa · Presença
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-toa-ink/50 mt-8 font-light leading-relaxed px-6">
            Enviamos também uma cópia para <span className="text-toa-bark">{voucher.email}</span>
          </p>

          <div className="text-center mt-6">
            <Link to="/" className="text-xs uppercase tracking-[0.2em] text-toa-gold hover:text-toa-sage transition-colors">
              Voltar ao início
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}