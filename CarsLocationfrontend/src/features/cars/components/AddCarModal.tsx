import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  Car,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Gauge,
  Fuel,
  Settings2,
  Tag,
  Hash,
  CalendarDays,
  Users,
  DollarSign,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import type { Category } from '../../../types'
import { createCar, getCategories } from '../services/carService'

interface AddCarModalProps {
  isOpen: boolean
  onClose: () => void
  onCarAdded: () => void
}

interface FormData {
  brand: string
  model: string
  registrationNumber: string
  productionYear: string
  seats: string
  transmission: string
  fuelType: string
  dailyBasePrice: string
  mileage: string
  description: string
  categoryId: string
  status: string
}

const INITIAL_FORM: FormData = {
  brand: '',
  model: '',
  registrationNumber: '',
  productionYear: '',
  seats: '',
  transmission: 'MANUAL',
  fuelType: 'PETROL',
  dailyBasePrice: '',
  mileage: '',
  description: '',
  categoryId: '',
  status: 'AVAILABLE',
}

const STEPS = ['identity', 'specs', 'pricing'] as const
type Step = (typeof STEPS)[number]

export default function AddCarModal({ isOpen, onClose, onCarAdded }: AddCarModalProps) {
  const { t } = useTranslation('common')
  const [step, setStep] = useState<Step>('identity')
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories).catch(() => {})
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleClose = () => {
    if (submitting) return
    setStep('identity')
    setForm(INITIAL_FORM)
    setSubmitError('')
    setSuccess(false)
    onClose()
  }

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const stepIndex = STEPS.indexOf(step)

  const canNext = () => {
    if (step === 'identity') return !!(form.brand && form.model && form.registrationNumber && form.productionYear)
    if (step === 'specs') return !!(form.seats && form.transmission && form.fuelType)
    return true
  }

  const goNext = () => { if (canNext() && stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1]) }
  const goPrev = () => { if (stepIndex > 0) setStep(STEPS[stepIndex - 1]) }

  const handleSubmit = async () => {
    setSubmitError('')
    setSubmitting(true)
    try {
      const payload = {
        brand: form.brand.trim(),
        model: form.model.trim(),
        registrationNumber: form.registrationNumber.trim().toUpperCase(),
        productionYear: Number(form.productionYear),
        seats: Number(form.seats),
        transmission: form.transmission,
        fuelType: form.fuelType,
        dailyBasePrice: Number(form.dailyBasePrice),
        mileage: form.mileage ? Number(form.mileage) : undefined,
        description: form.description.trim() || undefined,
        categoryId: form.categoryId || undefined,
        status: form.status,
      }
      await createCar(payload)
      setSuccess(true)
      setTimeout(() => {
        onCarAdded()
        handleClose()
      }, 1800)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : t('error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="acm-overlay"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        className="acm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative orb */}
        <div className="acm-orb" aria-hidden />

        {/* Header */}
        <div className="acm-header">
          <div className="acm-header-left">
            <div className="acm-icon-badge">
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <p className="acm-eyebrow">Fleet Management</p>
              <h2 className="acm-title">Add New Vehicle</h2>
            </div>
          </div>
          <button className="acm-close-btn" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="acm-steps">
          {STEPS.map((s, i) => {
            const isActive = s === step
            const isDone = STEPS.indexOf(step) > i
            const labels: Record<Step, string> = { identity: 'Identity', specs: 'Specs', pricing: 'Pricing' }
            return (
              <div key={s} className="acm-step-wrapper">
                <div className="acm-step-item">
                  <div className={`acm-step-circle ${isDone ? 'done' : isActive ? 'active' : 'idle'}`}>
                    {isDone ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span className={`acm-step-label ${isDone ? 'done' : isActive ? 'active' : 'idle'}`}>
                    {labels[s]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`acm-step-line ${isDone ? 'done' : ''}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Form Content */}
        {success ? (
          <div className="acm-success">
            <div className="acm-success-icon">
              <CheckCircle2 size={36} color="#fff" />
            </div>
            <div>
              <h3 className="acm-success-title">Vehicle Added!</h3>
              <p className="acm-success-desc">
                <strong className="acm-success-name">{form.brand} {form.model}</strong> has been successfully registered in your fleet.
              </p>
            </div>
          </div>
        ) : (
          <div className="acm-body">

            {/* Step 1 */}
            {step === 'identity' && (
              <div className="acm-step-content">
                <div className="acm-row">
                  <AcmField label="Brand" icon={<Car size={14} />} required>
                    <input id="acm-brand" className="acm-input" value={form.brand} onChange={set('brand')} placeholder="e.g. BMW" />
                  </AcmField>
                  <AcmField label="Model" icon={<Tag size={14} />} required>
                    <input id="acm-model" className="acm-input" value={form.model} onChange={set('model')} placeholder="e.g. X5" />
                  </AcmField>
                </div>
                <AcmField label="Registration Number" icon={<Hash size={14} />} required>
                  <input id="acm-reg" className="acm-input acm-mono" value={form.registrationNumber} onChange={set('registrationNumber')} placeholder="e.g. AB-123-CD" />
                </AcmField>
                <div className="acm-row">
                  <AcmField label="Production Year" icon={<CalendarDays size={14} />} required>
                    <input id="acm-year" type="number" className="acm-input" value={form.productionYear} onChange={set('productionYear')} placeholder="e.g. 2023" min={1900} max={new Date().getFullYear() + 1} />
                  </AcmField>
                  <AcmField label="Status" icon={<Gauge size={14} />}>
                    <select id="acm-status" className="acm-select" value={form.status} onChange={set('status')}>
                      <option value="AVAILABLE">Available</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>
                  </AcmField>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 'specs' && (
              <div className="acm-step-content">
                <div className="acm-row">
                  <AcmField label="Seats" icon={<Users size={14} />} required>
                    <input id="acm-seats" type="number" className="acm-input" value={form.seats} onChange={set('seats')} placeholder="e.g. 5" min={1} max={20} />
                  </AcmField>
                  <AcmField label="Mileage (km)" icon={<Gauge size={14} />}>
                    <input id="acm-mileage" type="number" className="acm-input" value={form.mileage} onChange={set('mileage')} placeholder="e.g. 12000" min={0} />
                  </AcmField>
                </div>
                <div className="acm-row">
                  <AcmField label="Transmission" icon={<Settings2 size={14} />} required>
                    <select id="acm-transmission" className="acm-select" value={form.transmission} onChange={set('transmission')}>
                      <option value="MANUAL">Manual</option>
                      <option value="AUTOMATIC">Automatic</option>
                    </select>
                  </AcmField>
                  <AcmField label="Fuel Type" icon={<Fuel size={14} />} required>
                    <select id="acm-fuel" className="acm-select" value={form.fuelType} onChange={set('fuelType')}>
                      <option value="PETROL">Petrol</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ELECTRIC">Electric</option>
                    </select>
                  </AcmField>
                </div>
                <AcmField label="Category" icon={<Tag size={14} />}>
                  <select id="acm-category" className="acm-select" value={form.categoryId} onChange={set('categoryId')}>
                    <option value="">— No category —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </AcmField>
              </div>
            )}

            {/* Step 3 */}
            {step === 'pricing' && (
              <div className="acm-step-content">
                <AcmField label="Daily Base Price (€)" icon={<DollarSign size={14} />} required>
                  <div className="acm-price-wrap">
                    <input id="acm-price" type="number" className="acm-input acm-price-input" value={form.dailyBasePrice} onChange={set('dailyBasePrice')} placeholder="0.00" min={0} step="0.01" />
                    <span className="acm-price-symbol">€</span>
                  </div>
                </AcmField>
                <AcmField label="Description" icon={<FileText size={14} />}>
                  <textarea id="acm-desc" className="acm-input acm-textarea" value={form.description} onChange={set('description')} placeholder="Optional — features, notes, condition..." rows={4} />
                </AcmField>

                {/* Summary card */}
                <div className="acm-summary-card">
                  <p className="acm-summary-title">Summary</p>
                  <div className="acm-summary-grid">
                    {([
                      ['Vehicle', `${form.brand} ${form.model}`],
                      ['Plate', form.registrationNumber.toUpperCase() || '—'],
                      ['Year', form.productionYear || '—'],
                      ['Seats', form.seats || '—'],
                      ['Fuel', form.fuelType],
                      ['Transmission', form.transmission],
                    ] as [string, string][]).map(([key, val]) => (
                      <div key={key} className="acm-summary-row">
                        <span className="acm-summary-key">{key}</span>
                        <span className="acm-summary-val">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {submitError && (
                  <div className="acm-error-box">
                    <AlertCircle size={15} color="#f87171" />
                    <span>{submitError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!success && (
          <div className="acm-footer">
            {stepIndex > 0 ? (
              <button className="acm-btn-secondary" onClick={goPrev}>
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <button className="acm-btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            )}

            {stepIndex < STEPS.length - 1 ? (
              <button className={`acm-btn-primary${!canNext() ? ' acm-btn-disabled' : ''}`} onClick={goNext} disabled={!canNext()}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className={`acm-btn-primary acm-btn-success${submitting || !form.dailyBasePrice ? ' acm-btn-disabled' : ''}`}
                onClick={handleSubmit}
                disabled={submitting || !form.dailyBasePrice}
              >
                {submitting ? (
                  <><Loader2 size={16} className="acm-spin" /> Adding car...</>
                ) : (
                  <>Add to Fleet <ArrowRight size={16} /></>
                )}
              </button>
            )}
          </div>
        )}

        <style>{`
          .acm-overlay {
            position: fixed; inset: 0; z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            padding: 16px;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(6px);
          }
          .acm-modal {
            position: relative; width: 100%; max-width: 560px;
            border-radius: 28px;
            background: linear-gradient(160deg, #0f0f14 0%, #16161f 100%);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 40px 80px rgba(0,0,0,0.6);
            max-height: 92vh; overflow-y: auto;
            animation: acm-slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .acm-orb {
            position: absolute; top: -80px; right: -80px;
            width: 260px; height: 260px; border-radius: 50%;
            background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%);
            pointer-events: none;
          }
          .acm-header {
            position: relative; padding: 28px 28px 20px;
            display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
          }
          .acm-header-left { display: flex; align-items: center; gap: 14px; }
          .acm-icon-badge {
            width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 20px rgba(124,58,237,0.45);
          }
          .acm-eyebrow {
            color: rgba(255,255,255,0.35); font-size: 10px; font-weight: 700;
            letter-spacing: 0.09em; text-transform: uppercase; margin: 0 0 2px;
          }
          .acm-title { color: #fff; font-size: 20px; font-weight: 800; margin: 0; line-height: 1.2; }
          .acm-close-btn {
            width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
            background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
            display: flex; align-items: center; justify-content: center;
            color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s;
          }
          .acm-close-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

          /* Steps */
          .acm-steps {
            position: relative; padding: 0 28px 20px;
            display: flex; align-items: center;
          }
          .acm-step-wrapper { display: flex; align-items: center; flex: 1; }
          .acm-step-wrapper:last-child { flex: none; }
          .acm-step-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
          .acm-step-circle {
            width: 36px; height: 36px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; font-weight: 700;
            transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .acm-step-circle.active {
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            border: none; color: #fff;
            box-shadow: 0 0 18px rgba(139,92,246,0.55);
          }
          .acm-step-circle.done {
            background: linear-gradient(135deg, #10b981, #059669);
            border: none; color: #fff;
          }
          .acm-step-circle.idle {
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.3);
          }
          .acm-step-label {
            font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
            text-transform: uppercase; transition: color 0.3s;
          }
          .acm-step-label.active { color: #fff; }
          .acm-step-label.done { color: #10b981; }
          .acm-step-label.idle { color: rgba(255,255,255,0.3); }
          .acm-step-line {
            flex: 1; height: 2px; margin: 0 8px; margin-bottom: 20px;
            border-radius: 99px; background: rgba(255,255,255,0.08);
            transition: background 0.4s;
          }
          .acm-step-line.done { background: #10b981; }

          /* Body */
          .acm-body { padding: 0 28px 24px; }
          .acm-step-content { display: flex; flex-direction: column; gap: 14px; animation: acm-fadein 0.25s ease; }
          .acm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

          /* Fields */
          .acm-field { display: flex; flex-direction: column; gap: 6px; }
          .acm-label {
            display: flex; align-items: center; gap: 6px;
            color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600;
            letter-spacing: 0.04em;
          }
          .acm-label-icon { color: rgba(255,255,255,0.28); display: flex; align-items: center; }
          .acm-required { color: #a855f7; font-size: 15px; line-height: 1; }
          .acm-input {
            width: 100%; height: 44px; padding: 0 14px;
            border-radius: 12px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.09);
            color: #fff; font-size: 14px; font-weight: 500;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .acm-input:focus {
            outline: none;
            border-color: rgba(139,92,246,0.6);
            box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
          }
          .acm-input::placeholder { color: rgba(255,255,255,0.2); }
          .acm-mono { font-family: monospace; letter-spacing: 0.08em; text-transform: uppercase; }
          .acm-select {
            width: 100%; height: 44px; padding: 0 36px 0 14px;
            border-radius: 12px;
            background: rgba(255,255,255,0.05) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 14px center;
            border: 1px solid rgba(255,255,255,0.09);
            color: #fff; font-size: 14px; font-weight: 500;
            box-sizing: border-box; appearance: none; cursor: pointer;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .acm-select:focus {
            outline: none;
            border-color: rgba(139,92,246,0.6);
            box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
          }
          .acm-select option { background: #1c1c28; color: #fff; }
          .acm-textarea {
            height: auto !important;
            padding: 12px 14px !important;
            resize: none; line-height: 1.6;
          }
          .acm-price-wrap { position: relative; }
          .acm-price-input { padding-left: 40px !important; }
          .acm-price-symbol {
            position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
            color: rgba(255,255,255,0.3); font-size: 15px; font-weight: 700;
            pointer-events: none;
          }

          /* Summary */
          .acm-summary-card {
            border-radius: 16px; border: 1px solid rgba(255,255,255,0.07);
            background: rgba(255,255,255,0.03); padding: 16px 18px;
          }
          .acm-summary-title {
            color: rgba(255,255,255,0.35); font-size: 10px; font-weight: 700;
            letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 12px;
          }
          .acm-summary-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px;
          }
          .acm-summary-row { display: flex; justify-content: space-between; align-items: center; }
          .acm-summary-key { color: rgba(255,255,255,0.35); font-size: 12px; }
          .acm-summary-val { color: rgba(255,255,255,0.85); font-size: 12px; font-weight: 600; }

          /* Error */
          .acm-error-box {
            display: flex; align-items: center; gap: 10px;
            padding: 12px 16px; border-radius: 12px;
            background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
            color: #f87171; font-size: 13px;
          }

          /* Success */
          .acm-success {
            padding: 32px 28px 40px;
            display: flex; flex-direction: column; align-items: center;
            gap: 16px; text-align: center;
          }
          .acm-success-icon {
            width: 72px; height: 72px; border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #059669);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 40px rgba(16,185,129,0.45);
            animation: acm-pop 0.4s cubic-bezier(0.22,1,0.36,1);
          }
          .acm-success-title { color: #fff; font-size: 20px; font-weight: 800; margin: 0 0 6px; }
          .acm-success-desc { color: rgba(255,255,255,0.5); font-size: 14px; margin: 0; }
          .acm-success-name { color: #10b981; }

          /* Footer */
          .acm-footer {
            padding: 0 28px 28px;
            display: flex; justify-content: space-between; gap: 12px;
          }
          .acm-btn-secondary {
            display: flex; align-items: center; gap: 6px;
            height: 44px; padding: 0 20px; border-radius: 12px;
            background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600;
            cursor: pointer; transition: background 0.2s;
          }
          .acm-btn-secondary:hover { background: rgba(255,255,255,0.12); }
          .acm-btn-primary {
            display: flex; align-items: center; gap: 8px;
            height: 44px; padding: 0 24px; border-radius: 12px;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            border: none; color: #fff; font-size: 14px; font-weight: 700;
            cursor: pointer; box-shadow: 0 4px 16px rgba(124,58,237,0.4);
            transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          }
          .acm-btn-primary:hover:not(.acm-btn-disabled) {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(124,58,237,0.55);
          }
          .acm-btn-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            box-shadow: 0 4px 16px rgba(16,185,129,0.4) !important;
          }
          .acm-btn-success:hover:not(.acm-btn-disabled) {
            box-shadow: 0 8px 24px rgba(16,185,129,0.55) !important;
          }
          .acm-btn-disabled { opacity: 0.45 !important; cursor: not-allowed !important; }

          .acm-spin { animation: acm-spin 1s linear infinite; display: inline-block; }

          @keyframes acm-slide-in {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes acm-pop {
            0%   { transform: scale(0.6); opacity: 0; }
            70%  { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes acm-fadein {
            from { opacity: 0; transform: translateX(10px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes acm-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}

function AcmField({ label, icon, required, children }: { label: string; icon: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="acm-field">
      <label className="acm-label">
        <span className="acm-label-icon">{icon}</span>
        {label}
        {required && <span className="acm-required">*</span>}
      </label>
      {children}
    </div>
  )
}
