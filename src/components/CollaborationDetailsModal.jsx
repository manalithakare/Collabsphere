import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  CheckCircle2,
  Building2,
  UserCheck,
  FileText,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { Modal } from './Modal.jsx';
import { StatusBadge } from './StatusBadge.jsx';
import { collaborationApi, paymentApi } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function CollaborationDetailsModal({ isOpen, onClose, collaboration, onUpdated }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!collaboration) return null;

  const isBrand = user?.role === 'Brand';
  const isInfluencer = user?.role === 'Influencer';

  const steps = [
    { key: 'Pending', label: 'Requested', desc: 'Brand sent request' },
    { key: 'Accepted', label: 'Accepted', desc: 'Creator agreed' },
    { key: 'In Progress', label: 'In Progress', desc: 'Content in creation' },
    { key: 'Completed', label: 'Completed', desc: 'Deliverables verified' },
  ];

  const currentStatusIndex = steps.findIndex((s) => s.key === collaboration.status);
  const isRejected = collaboration.status === 'Rejected';

  async function handleStatusChange(newStatus) {
    try {
      setIsUpdating(true);
      const res = await collaborationApi.updateStatus(collaboration.id || collaboration._id, newStatus);
      if (res.success) {
        addToast(`Status updated to "${newStatus}"`, 'success');
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleMarkPaid() {
    try {
      setIsUpdating(true);
      const res = await paymentApi.markAsPaid(collaboration.id || collaboration._id);
      if (res.success) {
        addToast(`Payment of $${collaboration.budget} marked as Paid!`, 'success');
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update payment', 'error');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Collaboration Details" maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              {collaboration.campaign?.category || 'Campaign'}
            </span>
            <h4 className="text-base font-semibold text-slate-900 mt-0.5">
              {collaboration.campaign?.title || 'Collaboration Initiative'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Product: <span className="font-medium text-slate-700">{collaboration.campaign?.productName || 'Featured Product'}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={collaboration.status} />
            {collaboration.payment && (
              <StatusBadge status={collaboration.payment.status} type="payment" />
            )}
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Milestone Progress</h5>
          {isRejected ? (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold">Collaboration Declined</p>
                <p className="text-[11px] text-rose-600 mt-0.5">This request was declined and is inactive.</p>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-between px-2">
              <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 z-0" />
              <div
                className="absolute top-3.5 left-6 h-0.5 bg-indigo-600 transition-all duration-300 z-0"
                style={{
                  width: `${Math.max(0, currentStatusIndex / (steps.length - 1)) * 88}%`,
                }}
              />
              {steps.map((step, idx) => {
                const isPassed = currentStatusIndex >= idx;
                const isCurrent = currentStatusIndex === idx;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center text-center max-w-[70px]">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-colors shadow-xs ${
                        isPassed
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      } ${isCurrent ? 'ring-3 ring-indigo-100' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-medium mt-1.5 ${isPassed ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Two Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* Parties */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
            <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Parties</h5>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Brand</span>
                <span className="text-xs font-semibold text-slate-800">
                  {collaboration.brand?.name || 'Brand Partner'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Creator</span>
                <span className="text-xs font-semibold text-slate-800">
                  {collaboration.influencer?.name || 'Creator'}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
            <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Terms</h5>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Compensation
              </span>
              <span className="font-semibold text-slate-900">${collaboration.budget || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Deadline
              </span>
              <span className="font-medium text-slate-800">{collaboration.deadline}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Payout
              </span>
              <span>
                {collaboration.payment?.status === 'Paid' ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Paid
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">Pending Release</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <h5 className="text-xs font-semibold">Deliverables</h5>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {collaboration.deliverables}
          </p>
        </div>

        {/* Message */}
        {collaboration.message && (
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-1">
            <h5 className="text-xs font-semibold text-slate-700">Brand Pitch Note</h5>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              "{collaboration.message}"
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          {/* Influencer Actions on Pending */}
          {isInfluencer && collaboration.status === 'Pending' && (
            <>
              <button
                type="button"
                onClick={() => handleStatusChange('Rejected')}
                disabled={isUpdating}
                className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('Accepted')}
                disabled={isUpdating}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Accept
              </button>
            </>
          )}

          {/* Influencer or Brand moving to In Progress */}
          {collaboration.status === 'Accepted' && (
            <button
              type="button"
              onClick={() => handleStatusChange('In Progress')}
              disabled={isUpdating}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Start Production
            </button>
          )}

          {/* Marking as Completed */}
          {collaboration.status === 'In Progress' && (
            <button
              type="button"
              onClick={() => handleStatusChange('Completed')}
              disabled={isUpdating}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Mark Completed
            </button>
          )}

          {/* Brand marking payment as Paid */}
          {isBrand &&
            collaboration.payment?.status !== 'Paid' &&
            ['Accepted', 'In Progress', 'Completed'].includes(collaboration.status) && (
              <button
                type="button"
                onClick={handleMarkPaid}
                disabled={isUpdating}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid (${collaboration.budget || 0})
              </button>
            )}

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CollaborationDetailsModal;
