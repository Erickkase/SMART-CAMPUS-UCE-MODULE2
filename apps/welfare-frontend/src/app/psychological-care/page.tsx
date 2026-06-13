'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Navigation } from '@/components/dashboard/navigation';
import {
  AppointmentStatus,
  CareModality,
  PsychologicalAppointment,
  PsychologicalRequest,
  RequestStatus,
  RiskLevel,
  createPsychologicalAppointment,
  createPsychologicalRequest,
  getPsychologicalAppointments,
  getPsychologicalRequests,
  updatePsychologicalAppointmentStatus,
} from '@/lib/api/psychological-care';

const initialRequestForm = {
  studentId: '',
  reason: '',
  priority: 'MEDIUM' as RiskLevel,
  status: 'REQUESTED' as RequestStatus,
};

const initialAppointmentForm = {
  studentId: '',
  psychologistId: '',
  appointmentDate: '',
  modality: 'IN_PERSON' as CareModality,
  status: 'SCHEDULED' as AppointmentStatus,
  notes: '',
};

const statusStyles: Record<string, string> = {
  REQUESTED: 'bg-amber-100 text-amber-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  REFERRED: 'bg-purple-100 text-purple-700',
  MISSED: 'bg-orange-100 text-orange-700',
};

export default function PsychologicalCarePage() {
  const [requests, setRequests] = useState<PsychologicalRequest[]>([]);
  const [appointments, setAppointments] = useState<PsychologicalAppointment[]>([]);
  const [requestForm, setRequestForm] = useState(initialRequestForm);
  const [appointmentForm, setAppointmentForm] = useState(initialAppointmentForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [requestData, appointmentData] = await Promise.all([
        getPsychologicalRequests(),
        getPsychologicalAppointments(),
      ]);
      setRequests(requestData);
      setAppointments(appointmentData);
    } catch {
      setError(
        'Unable to load psychological care data. Verify psychological-care-service is running.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createPsychologicalRequest(requestForm);
      setRequestForm(initialRequestForm);
      setMessage('Psychological care request created successfully.');
      await loadData();
    } catch {
      setError('Unable to create psychological care request. Check the form data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createPsychologicalAppointment({
        ...appointmentForm,
        appointmentDate: new Date(appointmentForm.appointmentDate).toISOString(),
      });
      setAppointmentForm(initialAppointmentForm);
      setMessage('Psychological appointment created successfully.');
      await loadData();
    } catch {
      setError('Unable to create psychological appointment. Check the form data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await updatePsychologicalAppointmentStatus(id, status);
      setMessage(`Appointment status updated to ${status}.`);
      await loadData();
    } catch {
      setError('Unable to update appointment status.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 lg:px-12">
      <Navigation />

      <section className="mx-auto mt-8 grid max-w-7xl gap-8 xl:grid-cols-[430px_1fr]">
        <aside className="space-y-8">
          <form
            className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic"
            onSubmit={handleRequestSubmit}
          >
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
              Psychological Care
            </p>
            <h1 className="mt-3 text-3xl font-black text-campus-navy">Create Request</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Register a student psychological care request. The backend starts it as REQUESTED.
            </p>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-campus-navy">studentId</span>
                <input
                  value={requestForm.studentId}
                  onChange={(event) =>
                    setRequestForm((current) => ({
                      ...current,
                      studentId: event.target.value,
                    }))
                  }
                  placeholder="2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-campus-navy">reason</span>
                <textarea
                  value={requestForm.reason}
                  onChange={(event) =>
                    setRequestForm((current) => ({ ...current, reason: event.target.value }))
                  }
                  placeholder="Student reports anxiety symptoms before exams"
                  className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-campus-navy">priority</span>
                <select
                  value={requestForm.priority}
                  onChange={(event) =>
                    setRequestForm((current) => ({
                      ...current,
                      priority: event.target.value as RiskLevel,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-campus-blue disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>

          <form
            className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic"
            onSubmit={handleAppointmentSubmit}
          >
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
              Appointments
            </p>
            <h2 className="mt-3 text-2xl font-black text-campus-navy">Schedule Appointment</h2>

            <div className="mt-7 space-y-5">
              <input
                value={appointmentForm.studentId}
                onChange={(event) =>
                  setAppointmentForm((current) => ({
                    ...current,
                    studentId: event.target.value,
                  }))
                }
                placeholder="studentId"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <input
                value={appointmentForm.psychologistId}
                onChange={(event) =>
                  setAppointmentForm((current) => ({
                    ...current,
                    psychologistId: event.target.value,
                  }))
                }
                placeholder="psychologistId"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <input
                type="datetime-local"
                value={appointmentForm.appointmentDate}
                onChange={(event) =>
                  setAppointmentForm((current) => ({
                    ...current,
                    appointmentDate: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <select
                value={appointmentForm.modality}
                onChange={(event) =>
                  setAppointmentForm((current) => ({
                    ...current,
                    modality: event.target.value as CareModality,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
              >
                <option value="IN_PERSON">IN_PERSON</option>
                <option value="VIRTUAL">VIRTUAL</option>
              </select>
              <textarea
                value={appointmentForm.notes}
                onChange={(event) =>
                  setAppointmentForm((current) => ({ ...current, notes: event.target.value }))
                }
                placeholder="Appointment notes"
                className="min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-campus-blue px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-campus-navy disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </aside>

        <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
                Psychological Management
              </p>
              <h2 className="mt-2 text-3xl font-black text-campus-navy">Care Dashboard</h2>
            </div>
            <button
              type="button"
              onClick={() => void loadData()}
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

          <div className="mt-7 grid gap-6 2xl:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Requests
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">Loading...</p>
                ) : requests.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">
                    No psychological requests found.
                  </p>
                ) : (
                  requests.map((request) => (
                    <article key={request.id} className="px-5 py-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-campus-navy">{request.studentId}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[request.status]
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600">{request.reason}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        Priority: {request.priority}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Appointments
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">Loading...</p>
                ) : appointments.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">
                    No appointments found.
                  </p>
                ) : (
                  appointments.map((appointment) => (
                    <article key={appointment.id} className="px-5 py-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-campus-navy">{appointment.studentId}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[appointment.status]
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600">{appointment.notes}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        {appointment.modality} | {new Date(appointment.appointmentDate).toLocaleString()}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(['COMPLETED', 'CANCELLED', 'MISSED'] as AppointmentStatus[]).map(
                          (status) => (
                            <button
                              key={status}
                              type="button"
                              disabled={actionId === appointment.id}
                              onClick={() => void handleAppointmentStatus(appointment.id, status)}
                              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-campus-navy hover:text-white disabled:opacity-50"
                            >
                              {status}
                            </button>
                          ),
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
