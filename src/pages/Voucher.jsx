import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Check, Copy, MessageCircle, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/vila/Logo';
import VoucherCard from '@/components/vila/VoucherCard';
import VoucherRules from '@/components/vila/VoucherRules';

// Vila Toá WhatsApp number — digits only, with country code
const VILA_TOA_WHATSAPP = '5500000000000';

export default function Voucher() {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const contactMessage = voucher
    ? `Olá! Resgatei meu vale-presente de R$150,00 da Vila Toá. Meu código é ${voucher.code} e gostaria de saber mais sobre hospedagem.`
    : '';

  const handleContactWhatsApp = () => {
    const url = `https://wa.me/${VILA_TOA_WHATSAPP}?text=${encodeURIComponent(contactMessage)}`;
    window.open(url, '_blank');
  };

  const handleSendToMyWhatsApp = () => {
    if (!voucher || sending) return;
    setSending(true);
    const phoneDigits = voucher.phone.replace(/\D/g, '');
    const fullNumber = phoneDigits.length <= 11 ? `55${phoneDigits}` : phoneDigits;
    const msg =
      `Seu vale-presente Vila Toá\n\n` +
      `Valor: R$ 150,00\n` +
      `Código: ${voucher.code}\n` +
      `Validade: 31/12/2026\n\n` +
      `Guarde este código com segurança. Ele será necessário no momento da reserva diretamente com a Vila Toá.`;
    const url = `https://wa.me/${fullNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setSent(true);
    setTimeout(() => setSending(false), 1200);
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
      <div className="relative h-[32vh] overflow-hidden">
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
          {/* Header */}
          <div className="text-center mb-8 px-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-4">
              <Sparkles className="w-5 h-5 text-toa-gold" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-toa-bark leading-tight">
              Vale-presente <span className="italic text-toa-gold">resgatado</span><br />
              com sucesso
            </h1>
            <p className="text-sm text-toa-ink/80 font-light leading-relaxed mt-4">
              Você ganhou um vale-presente de{' '}
              <span className="text-toa-bark font-medium">R$ 150,00</span>{' '}
              para usar em hospedagem na Vila Toá.
            </p>
          </div>

          {/* Voucher card */}
          <VoucherCard code={voucher.code} />

          {/* Security highlight */}
          <div className="mt-6 bg-toa-gold/10 border border-toa-gold/30 rounded-2xl px-5 py-4 text-center">
            <p className="font-serif italic text-toa-bark text-lg">
              Guarde este código com segurança
            </p>
          </div>

          {/* Explanation */}
          <p className="text-[13px] text-toa-ink/80 font-light leading-relaxed text-center mt-6 px-2">
            Para utilizar seu vale-presente de R$ 150,00, será necessário
            apresentar este código no momento da reserva diretamente com a Vila Toá.
          </p>

          {/* Important notice */}
          <div className="mt-5 flex items-start gap-3 bg-white border border-toa-bark/15 rounded-2xl px-5 py-4">
            <ShieldAlert className="w-4 h-4 text-toa-bark flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-[13px] text-toa-bark font-medium leading-relaxed">
              Sem este código, o benefício não poderá ser validado.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full h-12 rounded-full border-toa-gold/40 bg-white hover:bg-toa-sand text-toa-bark text-xs uppercase tracking-[0.15em]"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Código copiado' : 'Copiar código'}
            </Button>

            <Button
              onClick={handleContactWhatsApp}
              className="w-full h-12 rounded-full bg-toa-sage hover:bg-toa-sage/90 text-white text-xs uppercase tracking-[0.15em]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Falar com a Vila Toá no WhatsApp
            </Button>

            <Button
              onClick={handleSendToMyWhatsApp}
              disabled={sending}
              variant="ghost"
              className="w-full h-12 rounded-full text-toa-bark hover:bg-toa-bark/5 text-xs uppercase tracking-[0.15em]"
            >
              <Send className="w-4 h-4 mr-2" />
              {sent ? 'Código enviado' : 'Enviar código para meu WhatsApp'}
            </Button>
          </div>

          {/* Rules */}
          <VoucherRules />

          <p className="text-center text-[11px] text-toa-ink/50 mt-10 font-light tracking-wide">
            Vila Toá · Natureza, pausa e presença
          </p>
        </div>
      </motion.div>
    </div>
  );
}