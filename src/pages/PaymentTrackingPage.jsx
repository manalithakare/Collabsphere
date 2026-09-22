import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { paymentApi } from '../services/api.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function PaymentTrackingPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isBrand = user?.role === 'Brand';

  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, paidAmount: 0, pendingAmount: 0, totalTransactions: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadPayments() {
    try {
      setIsLoading(true);
      const res = await paymentApi.getAll();
      if (res.success) {
        setPayments(res.payments || []);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load payments', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function handleMarkPaid(paymentId, amount) {
    try {
      setIsUpdating(true);
      const res = await paymentApi.markAsPaid(paymentId);
      if (res.success) {
        addToast(`Payment of $${amount} marked as Paid!`, 'success');
        loadPayments();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update payment', 'error');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {isBrand
            ? 'Track your collaboration payouts and escrow releases.'
            : 'Track cleared earnings and pending collaboration disbursements.'}
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Total Volume</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">${summary.totalAmount.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">{summary.totalTransactions} transactions</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">{isBrand ? 'Total Paid' : 'Total Received'}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">${summary.paidAmount.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Successfully cleared</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Pending Escrow</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">${summary.pendingAmount.toLocaleString()}</div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting completion</span>
        </div>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 p-6">
          <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No payment records</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Payments are created automatically when paid collaborations are accepted.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-medium">
                <tr>
                  <th className="py-3 pl-4">Campaign</th>
                  <th className="py-3">{isBrand ? 'Creator' : 'Brand'}</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
                  <th className="py-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id || p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pl-4">
                      <span className="font-semibold text-slate-900 block truncate max-w-[160px]">{p.campaign?.title}</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[160px] block">{p.collaboration?.deliverables}</span>
                    </td>

                    <td className="py-3">
                      <span className="font-medium text-slate-800 block truncate max-w-[140px]">{p.counterparty?.name}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[140px] block">{p.counterparty?.email}</span>
                    </td>

                    <td className="py-3 font-semibold text-slate-900">
                      ${p.amount?.toLocaleString() || 0}
                    </td>

                    <td className="py-3">
                      <StatusBadge status={p.status} type="payment" />
                    </td>

                    <td className="py-3 text-slate-500">
                      {p.paidAt ? (
                        <span>{new Date(p.paidAt).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                    </td>

                    <td className="py-3 text-right pr-4">
                      {isBrand && p.status === 'Pending' ? (
                        <button
                          onClick={() => handleMarkPaid(p.id || p._id, p.amount)}
                          disabled={isUpdating}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
                        >
                          Mark Paid
                        </button>
                      ) : p.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Escrow</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentTrackingPage;
