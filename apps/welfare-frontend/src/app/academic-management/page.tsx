'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Navigation } from '@/components/dashboard/navigation';
import {
  Enrollment,
  EnrollmentStatus,
  Student,
  Subject,
  createEnrollment,
  createSubject,
  createStudent,
  deleteEnrollment,
  deleteSubject,
  deleteStudent,
  getEnrollments,
  getSubjects,
  getStudents,
  updateEnrollmentStatus,
} from '@/lib/api/academic-management';

const initialSubjectForm = {
  code: '',
  name: '',
  credits: '3',
  academicLevel: '1',
  isActive: true,
};

const initialStudentForm = {
  identification: '',
  firstName: '',
  lastName: '',
  email: '',
  academicProgram: '',
  isActive: true,
};

const initialEnrollmentForm = {
  studentId: '',
  subjectId: '',
  academicPeriod: '2026-1',
  status: 'ENROLLED' as EnrollmentStatus,
};

const enrollmentStatuses: EnrollmentStatus[] = [
  'ENROLLED',
  'DROPPED',
  'COMPLETED',
  'CANCELLED',
];

const statusStyles: Record<EnrollmentStatus, string> = {
  ENROLLED: 'bg-blue-100 text-blue-700',
  DROPPED: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

export default function AcademicManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [subjectForm, setSubjectForm] = useState(initialSubjectForm);
  const [enrollmentForm, setEnrollmentForm] = useState(initialEnrollmentForm);
  const [isLoading, setIsLoading] = useState(true);
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [subjectSubmitting, setSubjectSubmitting] = useState(false);
  const [enrollmentSubmitting, setEnrollmentSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAcademicData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [studentsData, subjectsData, enrollmentsData] = await Promise.all([
        getStudents(),
        getSubjects(),
        getEnrollments(),
      ]);
      setStudents(studentsData);
      setSubjects(subjectsData);
      setEnrollments(enrollmentsData);
    } catch {
      setError('Unable to load academic data. Verify api-gateway is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStudentSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createStudent(studentForm);
      setStudentForm(initialStudentForm);
      setMessage('Student created successfully.');
      await loadAcademicData();
    } catch {
      setError('Unable to create student. Check the form data and gateway status.');
    } finally {
      setStudentSubmitting(false);
    }
  };

  useEffect(() => {
    void loadAcademicData();
  }, []);

  const handleCreateSubject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubjectSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createSubject({
        code: subjectForm.code,
        name: subjectForm.name,
        credits: Number(subjectForm.credits),
        academicLevel: Number(subjectForm.academicLevel),
        isActive: subjectForm.isActive,
      });
      setSubjectForm(initialSubjectForm);
      setMessage('Subject created successfully.');
      await loadAcademicData();
    } catch {
      setError('Unable to create subject. Check the form data and gateway status.');
    } finally {
      setSubjectSubmitting(false);
    }
  };

  const handleCreateEnrollment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnrollmentSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createEnrollment(enrollmentForm);
      setEnrollmentForm(initialEnrollmentForm);
      setMessage('Enrollment created successfully.');
      await loadAcademicData();
    } catch {
      setError('Unable to create enrollment. Use valid UUID values and check the gateway.');
    } finally {
      setEnrollmentSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await deleteSubject(id);
      setMessage('Subject deleted successfully.');
      await loadAcademicData();
    } catch {
      setError('Unable to delete subject.');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await deleteStudent(id);
      setMessage('Student deleted successfully.');
      await loadAcademicData();
    } catch {
      setError('Unable to delete student.');
    } finally {
      setActionId(null);
    }
  };

  const handleEnrollmentStatus = async (id: string, status: EnrollmentStatus) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await updateEnrollmentStatus(id, status);
      setMessage('Enrollment status updated successfully.');
      await loadAcademicData();
    } catch {
      setError('Unable to update enrollment status.');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteEnrollment = async (id: string) => {
    setActionId(id);
    setMessage(null);
    setError(null);

    try {
      await deleteEnrollment(id);
      setMessage('Enrollment deleted successfully.');
      await loadAcademicData();
    } catch {
      setError('Unable to delete enrollment.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 lg:px-12">
      <Navigation />

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="rounded-[2rem] border border-white/70 bg-campus-navy p-8 text-white shadow-academic">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
            Academic Management
          </p>
          <h1 className="mt-3 text-4xl font-black">Students, Subjects and Enrollments</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
            Manage Module 1 academic records through the API Gateway routes
            /api/students, /api/subjects and /api/enrollments.
          </p>
        </div>

        {(message || error) && (
          <div
            className={`mt-6 rounded-2xl px-5 py-4 text-sm font-semibold ${
              message ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {message ?? error}
          </div>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-3">
          <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
                  Student Service
                </p>
                <h2 className="mt-2 text-3xl font-black text-campus-navy">Students</h2>
              </div>
            </div>

            <form className="mt-7 grid gap-4" onSubmit={handleCreateStudent}>
              <input
                value={studentForm.identification}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    identification: event.target.value,
                  }))
                }
                placeholder="1750000001"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={studentForm.firstName}
                  onChange={(event) =>
                    setStudentForm((current) => ({ ...current, firstName: event.target.value }))
                  }
                  placeholder="Ana"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                  required
                />
                <input
                  value={studentForm.lastName}
                  onChange={(event) =>
                    setStudentForm((current) => ({ ...current, lastName: event.target.value }))
                  }
                  placeholder="Perez"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                  required
                />
              </div>
              <input
                type="email"
                value={studentForm.email}
                onChange={(event) =>
                  setStudentForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="ana.perez@uce.edu.ec"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <input
                value={studentForm.academicProgram}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    academicProgram: event.target.value,
                  }))
                }
                placeholder="Computer Science"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <button
                type="submit"
                disabled={studentSubmitting}
                className="rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-campus-blue disabled:opacity-60"
              >
                {studentSubmitting ? 'Creating...' : 'Create Student'}
              </button>
            </form>

            <div className="mt-7 space-y-4">
              {students.map((student) => (
                <article key={student.id} className="rounded-2xl border border-slate-100 bg-white p-5">
                  <p className="break-all text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    {student.id}
                  </p>
                  <h3 className="mt-2 text-sm font-black text-campus-navy">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{student.email}</p>
                  <p className="text-sm text-slate-600">{student.academicProgram}</p>
                  <button
                    type="button"
                    disabled={actionId === student.id}
                    onClick={() => void handleDeleteStudent(student.id)}
                    className="mt-4 rounded-full bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white disabled:opacity-60"
                  >
                    Delete
                  </button>
                </article>
              ))}
              {!students.length && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                  {isLoading ? 'Loading students...' : 'No students registered yet.'}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
                  Subject Service
                </p>
                <h2 className="mt-2 text-3xl font-black text-campus-navy">
                  Subjects
                </h2>
              </div>
              <button
                type="button"
                onClick={() => void loadAcademicData()}
                className="rounded-full bg-campus-blue/10 px-5 py-3 text-sm font-bold text-campus-blue transition hover:bg-campus-blue hover:text-white"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={handleCreateSubject}>
              <input
                value={subjectForm.code}
                onChange={(event) =>
                  setSubjectForm((current) => ({ ...current, code: event.target.value }))
                }
                placeholder="CS-101"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <input
                value={subjectForm.name}
                onChange={(event) =>
                  setSubjectForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Introduction to Computer Science"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <input
                type="number"
                min="1"
                value={subjectForm.credits}
                onChange={(event) =>
                  setSubjectForm((current) => ({ ...current, credits: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <input
                type="number"
                min="1"
                value={subjectForm.academicLevel}
                onChange={(event) =>
                  setSubjectForm((current) => ({
                    ...current,
                    academicLevel: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              />
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-campus-navy">
                <input
                  type="checkbox"
                  checked={subjectForm.isActive}
                  onChange={(event) =>
                    setSubjectForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                />
                Active subject
              </label>
              <button
                type="submit"
                disabled={subjectSubmitting}
                className="rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-campus-blue disabled:opacity-60"
              >
                {subjectSubmitting ? 'Creating...' : 'Create Subject'}
              </button>
            </form>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Code</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Credits</th>
                      <th className="px-5 py-4">Level</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {subjects.map((subject) => (
                      <tr key={subject.id}>
                        <td className="px-5 py-4 font-bold text-campus-navy">{subject.code}</td>
                        <td className="px-5 py-4 text-slate-600">{subject.name}</td>
                        <td className="px-5 py-4 text-slate-600">{subject.credits}</td>
                        <td className="px-5 py-4 text-slate-600">{subject.academicLevel}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            disabled={actionId === subject.id}
                            onClick={() => void handleDeleteSubject(subject.id)}
                            className="rounded-full bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!subjects.length && (
                      <tr>
                        <td className="px-5 py-8 text-center text-slate-500" colSpan={5}>
                          {isLoading ? 'Loading subjects...' : 'No subjects registered yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-academic">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-campus-gold">
                Enrollment Service
              </p>
              <h2 className="mt-2 text-3xl font-black text-campus-navy">Enrollments</h2>
            </div>

            <form className="mt-7 grid gap-4" onSubmit={handleCreateEnrollment}>
              <select
                value={enrollmentForm.studentId}
                onChange={(event) =>
                  setEnrollmentForm((current) => ({
                    ...current,
                    studentId: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.id}
                  </option>
                ))}
              </select>
              <select
                value={enrollmentForm.subjectId}
                onChange={(event) =>
                  setEnrollmentForm((current) => ({
                    ...current,
                    subjectId: event.target.value,
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                required
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.id}
                  </option>
                ))}
              </select>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={enrollmentForm.academicPeriod}
                  onChange={(event) =>
                    setEnrollmentForm((current) => ({
                      ...current,
                      academicPeriod: event.target.value,
                    }))
                  }
                  placeholder="2026-1"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                  required
                />
                <select
                  value={enrollmentForm.status}
                  onChange={(event) =>
                    setEnrollmentForm((current) => ({
                      ...current,
                      status: event.target.value as EnrollmentStatus,
                    }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-campus-blue focus:ring-4 focus:ring-campus-blue/10"
                >
                  {enrollmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={enrollmentSubmitting}
                className="rounded-2xl bg-campus-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-campus-blue disabled:opacity-60"
              >
                {enrollmentSubmitting ? 'Creating...' : 'Create Enrollment'}
              </button>
            </form>

            <div className="mt-7 space-y-4">
              {enrollments.map((enrollment) => (
                <article
                  key={enrollment.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-all text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                        {enrollment.studentId}
                      </p>
                      <h3 className="mt-2 break-all text-sm font-black text-campus-navy">
                        Subject: {enrollment.subjectId}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Period {enrollment.academicPeriod}
                      </p>
                    </div>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[enrollment.status]
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {enrollmentStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={actionId === enrollment.id || status === enrollment.status}
                        onClick={() => void handleEnrollmentStatus(enrollment.id, status)}
                        className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-campus-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={actionId === enrollment.id}
                      onClick={() => void handleDeleteEnrollment(enrollment.id)}
                      className="rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {!enrollments.length && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                  {isLoading ? 'Loading enrollments...' : 'No enrollments registered yet.'}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
