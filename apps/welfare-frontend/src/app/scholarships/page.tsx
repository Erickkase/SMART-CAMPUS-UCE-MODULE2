'use client';

import { FormEvent, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Navigation } from '@/components/dashboard/navigation';
import {
  Scholarship,
  ScholarshipStatus,
  createScholarship,
  deleteScholarship,
  getScholarships,
  updateScholarshipStatus,
} from '@/lib/api/scholarships';

const initialFormState = {
  studentId: '',
  scholarshipType: '',
  reason: '',
  status: 'PENDING' as ScholarshipStatus,
};

const statusStyles: Record<ScholarshipStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;

  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as { message?: string | string[] }).message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    if (message) {
      return message;
    }
  }

  return fallback;
};

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadScholarships = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getScholarships();
      setScholarships(data);
    } catch {
      setError('Unable to load scholarships. Verify scholarship-service is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadScholarships();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createScholarship(form);
      setForm(initialFormState);
      setMessage('Scholarship request created successfully.');
      await loadScholarships();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          'Unable to create scholarship. Check the form data and API status.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: Extract<ScholarshipStatus, 'APPROVED' | 'REJECTED'>,
  ) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await updateScholarshipStatus(id, status);
      setMessage(`Scholarship ${status.toLowerCase()} successfully.`);
      await loadScholarships();
    } catch (error) {
      setError(
        getApiErrorMessage(error, `Unable to update scholarship status to ${status}.`),
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await deleteScholarship(id);
      setMessage('Scholarship deleted successfully.');
      await loadScholarships();
    } catch {
      setError('Unable to delete scholarship.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 lg:px-12">
      <Navigation />

      <section className="mx-auto mt-8 grid max-w-7xl gap-8 xl:grid-cols-[420px_1fr]">
        <aside className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
            Scholarship Service
          </p>
          <h1 className="mt-3 text-3xl font-black text-campus-navy">
            Create Scholarship Request
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Register a test scholarship request. The backend generates the id automatically.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-bold text-campus-navy">studentId</span>
              <input
                value={form.studentId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, studentId: event.target.value }))
                }
                placeholder="2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-campus-navy">scholarshipType</span>
              <input
                value={form.scholarshipType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    scholarshipType: event.target.value,
                  }))
                }
                placeholder="ECONOMIC_SUPPORT"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-campus-navy">reason</span>
              <textarea
                value={form.reason}
                onChange={(event) =>
                  setForm((current) => ({ ...current, reason: event.target.value }))
                }
                placeholder="Financial hardship due to family situation"
                className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-campus-navy">status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as ScholarshipStatus,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
              >
                <option value="PENDING">PENDING</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-campus-blue disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create Scholarship'}
            </button>
          </form>
        </aside>

        <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
                Scholarship Requests
              </p>
              <h2 className="mt-2 text-3xl font-black text-campus-navy">
                Scholarship Management
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void loadScholarships()}
              className="rounded-full bg-campus-blue/10 px-5 py-3 text-sm font-bold text-campus-blue transition hover:bg-campus-blue hover:text-white"
            >
              {isLoading ? 'Refreshing...' : 'Refresh List'}
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
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-slate-500" colSpan={5}>
                        Loading scholarships...
                      </td>
                    </tr>
                  ) : scholarships.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-slate-500" colSpan={5}>
                        No scholarship requests found.
                      </td>
                    </tr>
                  ) : (
                    scholarships.map((scholarship) => {
                      const canUpdateStatus =
                        scholarship.status === 'PENDING' || scholarship.status === 'UNDER_REVIEW';

                      return (
                      <tr key={scholarship.id} className="align-top">
                        <td className="px-5 py-4 font-semibold text-campus-navy">
                          <span className="block max-w-44 truncate">{scholarship.studentId}</span>
                          <span className="mt-1 block max-w-44 truncate text-xs font-normal text-slate-400">
                            {scholarship.id}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {scholarship.scholarshipType}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <span className="block max-w-xs">{scholarship.reason}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              statusStyles[scholarship.status]
                            }`}
                          >
                            {scholarship.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={!canUpdateStatus || actionId === scholarship.id}
                              onClick={() =>
                                void handleStatusUpdate(scholarship.id, 'APPROVED')
                              }
                              className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={!canUpdateStatus || actionId === scholarship.id}
                              onClick={() =>
                                void handleStatusUpdate(scholarship.id, 'REJECTED')
                              }
                              className="rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              disabled={actionId === scholarship.id}
                              onClick={() => void handleDelete(scholarship.id)}
                              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })
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
