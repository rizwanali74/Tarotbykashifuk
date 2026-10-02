import React from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const statusColors = {
  'Pending Review': '#f59e0b',
  'Session Scheduled': '#38bdf8',
  Completed: '#34d399',
  Cancelled: '#fb7185',
};
const categoryColors = ['#f97316', '#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];

export default function AdminDashboardCharts({ orders, catalog }) {
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const monthOrders = orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt.getFullYear() === monthDate.getFullYear()
        && createdAt.getMonth() === monthDate.getMonth();
    });

    return {
      month: monthDate.toLocaleDateString('en-GB', { month: 'short' }),
      bookings: monthOrders.length,
      revenue: monthOrders.reduce((total, order) => {
        const numericTotal = Number(order.totalNumeric)
          || Number(String(order.total || '').replace(/[^\d.]/g, ''))
          || 0;
        return total + numericTotal;
      }, 0),
    };
  });

  const statusData = Object.entries(statusColors)
    .map(([name, color]) => ({ name, color, value: orders.filter((order) => order.status === name).length }))
    .filter((status) => status.value > 0);
  const categoryData = catalog.categories
    .map((category, index) => ({
      name: category.name,
      color: categoryColors[index % categoryColors.length],
      value: catalog.services.filter((service) => service.isActive && service.category === category.name).length,
    }))
    .filter((category) => category.value > 0);

  return (
    <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.9fr)_minmax(260px,0.9fr)]">
      <div className="min-w-0 rounded-xl border border-white/10 bg-[#0c101d]/90 p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-white">Bookings & revenue</h2>
          <p className="mt-1 text-xs text-slate-400">Monthly activity for the last six months</p>
        </div>
        {orders.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={monthlyData} margin={{ top: 8, right: 6, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="#ffffff12" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="bookings" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="revenue" orientation="right" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #334155', borderRadius: 8, color: '#f8fafc' }}
                formatter={(value, name) => [name === 'Revenue (£)' ? `£${Number(value).toFixed(2)}` : value, name]}
              />
              <Bar yAxisId="bookings" dataKey="bookings" name="Bookings" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Line yAxisId="revenue" dataKey="revenue" name="Revenue (£)" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#34d399' }} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[260px] items-center justify-center text-sm text-slate-500">Booking activity will appear here.</div>
        )}
        <div className="mt-2 flex flex-wrap gap-5 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-orange-500" /> Bookings</span>
          <span className="inline-flex items-center gap-2"><span className="h-0.5 w-3 bg-emerald-400" /> Revenue</span>
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-white/10 bg-[#0c101d]/90 p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-white">Order status</h2>
          <p className="mt-1 text-xs text-slate-400">Current booking pipeline</p>
        </div>
        {statusData.length ? (
          <div className="grid min-w-0 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(110px,0.8fr)]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3} stroke="none">
                  {statusData.map((status) => <Cell key={status.name} fill={status.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155', borderRadius: 8, color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2.5">
              {statusData.map((status) => (
                <li key={status.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex min-w-0 items-center gap-2 text-slate-400"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: status.color }} /><span className="truncate">{status.name}</span></span>
                  <span className="font-semibold text-white">{status.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">No orders to summarize yet.</div>
        )}
      </div>

      <div className="min-w-0 rounded-xl border border-white/10 bg-[#0c101d]/90 p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-white">Active services by category</h2>
          <p className="mt-1 text-xs text-slate-400">Services currently visible on the website</p>
        </div>
        {categoryData.length ? (
          <div className="grid min-w-0 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(110px,0.8fr)]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3} stroke="none">
                  {categoryData.map((category) => <Cell key={category.name} fill={category.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155', borderRadius: 8, color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2.5">
              {categoryData.map((category) => (
                <li key={category.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex min-w-0 items-center gap-2 text-slate-400"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: category.color }} /><span className="truncate">{category.name}</span></span>
                  <span className="font-semibold text-white">{category.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">No active services yet.</div>
        )}
      </div>
    </section>
  );
}
