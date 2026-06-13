'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Navigation } from '@/components/dashboard/navigation';
import {
  SocioeconomicForm,
  createSocioeconomicForm,
  deleteSocioeconomicForm,
  getSocioeconomicFormByStudentId,
  getSocioeconomicForms,
  updateSocioeconomicForm,
} from '@/lib/api/socioeconomic-forms';

const initialFormState = {
  studentId: '',
  familyIncome: '0',
  housingType: '',
  familyMembers: '1',
  employmentStatus: '',
  vulnerabilityFactors: '',
  observations: '',
};

export default function SocioeconomicFormsPage() {
  const [forms, setForms] = useState<SocioeconomicForm[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadForms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSocioeconomicForms();
      setForms(data);
    } catch {
      setError(
        'Unable to load socioeconomic forms. Verify socioeconomic-form-service is running.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadForms();
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    const payload = {
      familyIncome: Number(form.familyIncome),
      housingType: form.housingType,
      familyMembers: Number(form.familyMembers),
      employmentStatus: form.employmentStatus,
      vulnerabilityFactors: form.vulnerabilityFactors,
      observations: form.observations,
    };

    try {
      if (editingId) {
        await updateSocioeconomicForm(editingId, payload);
        setMessage('Socioeconomic form updated successfully.');
      } else {
        await createSocioeconomicForm({ studentId: form.studentId, ...payload });
        setMessage('Socioeconomic form created successfully.');
      }

      resetForm();
      await loadForms();
    } catch {
      setError('Unable to save socioeconomic form. Check the form data and API status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchByStudentId = async () => {
    if (!studentSearch.trim()) {
      await loadForms();
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const result = await getSocioeconomicFormByStudentId(studentSearch.trim());
      setForms([result]);
      setMessage('Socioeconomic form found successfully.');
    } catch {
      setForms([]);
      setError('No socioeconomic form was found for the provided studentId.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (selectedForm: SocioeconomicForm) => {
    setEditingId(selectedForm.id);
    setForm({
      studentId: selectedForm.studentId,
      familyIncome: String(selectedForm.familyIncome),
      housingType: selectedForm.housingType,
      familyMembers: String(selectedForm.familyMembers),
      employmentStatus: selectedForm.employmentStatus,
      vulnerabilityFactors: selectedForm.vulnerabilityFactors,
      observations: selectedForm.observations,
    });
    setMessage('Editing selected socioeconomic form.');
    setError(null);
  };

  const handleDelete = async (id: string) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await deleteSocioeconomicForm(id);
      setMessage('Socioeconomic form deleted successfully.');
      await loadForms();
    } catch {
      setError('Unable to delete socioeconomic form.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 lg:px-12">
      <Navigation />

      <section className="mx-auto mt-8 grid max-w-7xl gap-8 xl:grid-cols-[430px_1fr]">
        <aside className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
            Socioeconomic Service
          </p>
          <h1 className="mt-3 text-3xl font-black text-campus-navy">
            {editingId ? 'Update Socioeconomic Form' : 'Create Socioeconomic Form'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Register student socioeconomic information for welfare support evaluation.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-bold text-campus-navy">studentId</span>
              <input
                value={form.studentId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, studentId: event.target.value }))
                }
                disabled={Boolean(editingId)}
                placeholder="2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10 disabled:bg-slate-100"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-campus-navy">familyIncome</span>
                <input
                  type="number"
                  min="0"
                  value={form.familyIncome}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, familyIncome: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-campus-navy">familyMembers</span>
                <input
                  type="number"
                  min="1"
                  value={form.familyMembers}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, familyMembers: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-campus-navy">housingType</span>
              <input
                value={form.housingType}
                onChange={(event) =>
                  setForm((current) => ({ ...current, housingType: event.target.value }))
                }
                placeholder="RENTED"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-campus-navy">employmentStatus</span>
              <input
                value={form.employmentStatus}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    employmentStatus: event.target.value,
                  }))
                }
                placeholder="UNEMPLOYED"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-campus-navy">vulnerabilityFactors</span>
              <textarea
                value={form.vulnerabilityFactors}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    vulnerabilityFactors: event.target.value,
                  }))
                }
                placeholder="Single-parent household"
                className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-campus-navy">observations</span>
              <textarea
                value={form.observations}
                onChange={(event) =>
                  setForm((current) => ({ ...current, observations: event.target.value }))
                }
                placeholder="Student requires socioeconomic support evaluation"
                className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-campus-blue disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update Form' : 'Create Form'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Clear
              </button>
            </div>
          </form>
        </aside>

        <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
                Socioeconomic Forms
              </p>
              <h2 className="mt-2 text-3xl font-black text-campus-navy">
                Form Management
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void loadForms()}
              className="rounded-full bg-campus-blue/10 px-5 py-3 text-sm font-bold text-campus-blue transition hover:bg-campus-blue hover:text-white"
            >
              {isLoading ? 'Refreshing...' : 'Refresh List'}
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder="Search by studentId"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
            />
            <button
              type="button"
              onClick={() => void handleSearchByStudentId()}
              className="rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-campus-blue"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setStudentSearch('');
                void loadForms();
              }}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Reset
            </button>
          </div>

          {(message || error) && (
            <div
              className={`mt-6 rounded-2xl px-4 py-3 text-sm font-semibold ${
                message ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {message ?? error}
            </div>
          )}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Income</th>
                    <th className="px-5 py-4">Housing</th>
                    <th className="px-5 py-4">Members</th>
                    <th className="px-5 py-4">Employment</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-slate-500" colSpan={6}>
                        Loading socioeconomic forms...
                      </td>
                    </tr>
                  ) : forms.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-slate-500" colSpan={6}>
                        No socioeconomic forms found.
                      </td>
                    </tr>
                  ) : (
                    forms.map((item) => (
                      <tr key={item.id} className="align-top">
                        <td className="px-5 py-4 font-semibold text-campus-navy">
                          <span className="block max-w-44 truncate">{item.studentId}</span>
                          <span className="mt-1 block max-w-44 truncate text-xs font-normal text-slate-400">
                            {item.id}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-700">{item.familyIncome}</td>
                        <td className="px-5 py-4 text-slate-700">{item.housingType}</td>
                        <td className="px-5 py-4 text-slate-700">{item.familyMembers}</td>
                        <td className="px-5 py-4 text-slate-700">
                          {item.employmentStatus}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={actionId === item.id}
                              onClick={() => handleEdit(item)}
                              className="rounded-full bg-campus-blue/10 px-3 py-2 text-xs font-bold text-campus-blue transition hover:bg-campus-blue hover:text-white disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={actionId === item.id}
                              onClick={() => void handleDelete(item.id)}
                              className="rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-600 hover:text-white disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
