import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import Logo from '@/components/vila/Logo';
import Ornament from '@/components/vila/Ornament';

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TOA-${code}`;
};

export default function Capture() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    recipient_name: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone) return;
    setSubmitting(true);

    const code = generateCode();
    const voucher = await base44.entities.GiftVoucher.create({
      ...form,
      code,
      status: 'emitido'
    });

    navigate(`/vale/${voucher.id}`);
  };

  return (
    <div className="min-h-screen bg-toa-sand">
      {/* Hero image */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&q=80"
          alt="Vila Toá"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#362822]/20 via-transparent to-[#F7F4EF]" />

        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <Logo variant="light" />
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="px-6 pb-20 -mt-16 relative z-10"
      >
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_8px_40px_rgba(54,40,34,0.08)] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Leaf className="w-5 h-5 text-toa-gold" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-toa-bark leading-tight mb-3">
              Um presente<br />
              <span className="italic text-toa-gold">à altura do sentir</span>
            </h1>
            <Ornament className="my-5" />
            <p className="text-sm leading-relaxed text-toa-ink/80 font-light">
              Deixe seus dados e receba um vale-presente exclusivo
              para vivenciar a Vila Toá.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Nome completo" value={form.full_name} onChange={handleChange('full_name')} placeholder="Seu nome" required />
            <Field label="E-mail" type="email" value={form.email} onChange={handleChange('email')} placeholder="voce@email.com" required />
            <Field label="Telefone" value={form.phone} onChange={handleChange('phone')} placeholder="(00) 00000-0000" required />
            <Field label="Nome do presenteado" value={form.recipient_name} onChange={handleChange('recipient_name')} placeholder="(opcional)" />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-toa-sage hover:bg-toa-sage/90 text-white font-sans tracking-wide text-sm uppercase transition-all duration-300 mt-4"
            >
              {submitting ? 'Gerando vale...' : 'Receber vale-presente'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-toa-ink/50 mt-8 font-light tracking-wide">
          Vila Toá · Natureza, pausa e presença
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-[0.15em] text-toa-ink/70 font-medium">
        {label}
      </Label>
      <Input
        {...props}
        className="h-12 rounded-xl border-toa-gold/20 bg-toa-sand/50 focus-visible:ring-toa-sage focus-visible:border-toa-sage text-toa-bark placeholder:text-toa-ink/40"
      />
    </div>
  );
}