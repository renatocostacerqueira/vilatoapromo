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
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `VILATOA-${code}`;
};

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Capture() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === 'phone' ? maskPhone(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Informe seu nome completo';
    if (!form.email.trim()) errs.email = 'Informe seu e-mail';
    else if (!isValidEmail(form.email.trim())) errs.email = 'E-mail inválido';
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (!phoneDigits) errs.phone = 'Informe seu WhatsApp';
    else if (phoneDigits.length < 10) errs.phone = 'WhatsApp inválido';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    const email = form.email.trim().toLowerCase();
    const phone = form.phone;

    // Check duplicates
    const [byEmail, byPhone] = await Promise.all([
      base44.entities.GiftVoucher.filter({ email }),
      base44.entities.GiftVoucher.filter({ phone })
    ]);

    if (byEmail.length > 0) {
      setErrors({ email: 'Este e-mail já resgatou um vale-presente' });
      setSubmitting(false);
      return;
    }
    if (byPhone.length > 0) {
      setErrors({ phone: 'Este WhatsApp já resgatou um vale-presente' });
      setSubmitting(false);
      return;
    }

    const code = generateCode();
    const voucher = await base44.entities.GiftVoucher.create({
      full_name: form.full_name.trim(),
      email,
      phone,
      code,
      status: 'emitido'
    });

    navigate(`/vale/${voucher.id}`);
  };

  return (
    <div className="min-h-screen bg-toa-sand">
      {/* Hero image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src="https://media.base44.com/images/public/69eb50b879112948be76e574/ca22df521_422353874.jpg"
          alt="Vila Toá — vista aérea"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#362822]/25 via-transparent to-[#F7F4EF]" />
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <Logo variant="light" />
        </div>
      </div>

      {/* Content */}
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
            <h1 className="font-serif text-3xl md:text-[2.25rem] text-toa-bark leading-[1.15] mb-4">
              Seu presente da <br />
              <span className="italic text-toa-gold">Vila Toá</span> está aqui.
            </h1>
            <Ornament className="my-5" />
            <p className="text-sm leading-relaxed text-toa-ink/85 font-light">
              Preencha seus dados para resgatar seu vale-presente de
              {' '}<span className="text-toa-bark font-medium">R$ 150,00</span>{' '}
              para usar em hospedagem.
            </p>
            <p className="text-xs leading-relaxed text-toa-ink/65 font-light mt-4 italic">
              Um benefício exclusivo para quem vive o beach tennis
              e quer viver também um momento de descanso na Vila Toá.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Field
              label="Nome completo"
              value={form.full_name}
              onChange={handleChange('full_name')}
              placeholder="Seu nome"
              error={errors.full_name}
            />
            <Field
              label="E-mail"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="voce@email.com"
              error={errors.email}
            />
            <Field
              label="WhatsApp"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="(00) 00000-0000"
              error={errors.phone}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-toa-sage hover:bg-toa-sage/90 text-white font-sans tracking-wide text-sm uppercase transition-all duration-300 mt-4"
            >
              {submitting ? 'Gerando vale...' : 'Resgatar meu vale-presente'}
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

function Field({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-[0.15em] text-toa-ink/70 font-medium">
        {label}
      </Label>
      <Input
        {...props}
        className={`h-12 rounded-xl bg-toa-sand/50 focus-visible:ring-toa-sage text-toa-bark placeholder:text-toa-ink/40 ${
          error ? 'border-destructive focus-visible:border-destructive' : 'border-toa-gold/20 focus-visible:border-toa-sage'
        }`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}