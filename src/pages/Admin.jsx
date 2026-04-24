import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Lock, Search } from 'lucide-react';
import Logo from '@/components/vila/Logo';
import AdminTable from '@/components/vila/AdminTable';

const ADMIN_PASSWORD = 'vilatoa2026';
const SESSION_KEY = 'vila_toa_admin';

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.GiftVoucher.list('-created_date', 500);
    setVouchers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPassword('');
  };

  const handleStatusChange = async (voucher, newStatus) => {
    await base44.entities.GiftVoucher.update(voucher.id, { status: newStatus });
    setVouchers((prev) => prev.map((v) => (v.id === voucher.id ? { ...v, status: newStatus } : v)));
  };

  const filtered = vouchers.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      v.full_name?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q) ||
      v.code?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const headers = ['Nome', 'E-mail', 'WhatsApp', 'Código', 'Status', 'Data'];
    const rows = filtered.map((v) => [
      v.full_name || '',
      v.email || '',
      v.phone || '',
      v.code || '',
      v.status || '',
      new Date(v.created_date).toLocaleString('pt-BR')
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vila-toa-cadastros-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-toa-sand flex items-center justify-center px-6">
        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(54,40,34,0.08)] p-8">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-toa-sand flex items-center justify-center">
                <Lock className="w-5 h-5 text-toa-gold" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="font-serif text-2xl text-center text-toa-bark mb-2">Área restrita</h1>
            <p className="text-xs text-center text-toa-ink/60 mb-6 font-light">
              Digite a senha para acessar
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-[0.15em] text-toa-ink/70">Senha</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-toa-gold/20 bg-toa-sand/50 focus-visible:ring-toa-sage"
                  autoFocus
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-toa-sage hover:bg-toa-sage/90 text-white uppercase tracking-wider text-xs"
              >
                Entrar
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const emitidos = vouchers.filter((v) => v.status === 'emitido').length;
  const utilizados = vouchers.filter((v) => v.status === 'utilizado').length;
  const stats = {
    total: vouchers.length,
    emitidos,
    utilizados,
    pendentes: emitidos
  };

  return (
    <div className="min-h-screen bg-toa-sand">
      <header className="bg-white border-b border-toa-gold/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Logo />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-xs uppercase tracking-wider text-toa-ink/60 hover:text-toa-bark"
          >
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-toa-gold mb-2">Dashboard</p>
          <h1 className="font-serif text-3xl md:text-4xl text-toa-bark">Cadastros & Vales</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total de cadastros" value={stats.total} />
          <StatCard label="Vouchers emitidos" value={stats.emitidos} />
          <StatCard label="Utilizados" value={stats.utilizados} accent />
          <StatCard label="Pendentes" value={stats.pendentes} />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-toa-ink/40" />
            <Input
              placeholder="Buscar por nome, e-mail, WhatsApp ou código"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-11 rounded-full border-toa-gold/20 bg-white focus-visible:ring-toa-sage"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-44 h-11 rounded-full border-toa-gold/20 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="emitido">Emitido</SelectItem>
              <SelectItem value="utilizado">Utilizado</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={exportCSV}
            className="h-11 rounded-full bg-toa-bark hover:bg-toa-bark/90 text-toa-sand px-6 text-xs uppercase tracking-wider"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        <AdminTable
          vouchers={filtered}
          loading={loading}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? 'bg-toa-bark text-toa-sand border-toa-bark' : 'bg-white border-toa-gold/10'}`}>
      <p className={`text-[10px] uppercase tracking-[0.25em] ${accent ? 'text-toa-gold' : 'text-toa-ink/60'}`}>
        {label}
      </p>
      <p className={`font-serif text-3xl mt-2 ${accent ? 'text-toa-sand' : 'text-toa-bark'}`}>
        {value}
      </p>
    </div>
  );
}