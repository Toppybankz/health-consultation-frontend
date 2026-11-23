import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/doctor.jpg";

const features = [
  {
    number: "01",
    title: "Patient and doctor accounts",
    description: "Separate registration and sign-in journeys for patients and healthcare professionals.",
  },
  {
    number: "02",
    title: "Doctor approval workflow",
    description: "New doctor applications remain pending until an administrator reviews and approves them.",
  },
  {
    number: "03",
    title: "Private real-time messaging",
    description: "Approved participants can exchange messages in authenticated private conversations.",
  },
  {
    number: "04",
    title: "Administrator oversight",
    description: "A protected dashboard supports account review and user-status management.",
  },
];

const Home = () => (
  <div className="bg-white text-slate-800">
    <section
      className="relative flex min-h-[520px] items-center bg-cover bg-center md:min-h-[620px]"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="absolute inset-0 bg-slate-950/65" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-white">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Digital health consultation platform
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          A clearer way to connect patients and healthcare professionals.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
          A portfolio demonstration of patient and doctor accounts, administrator approval,
          and private real-time communication in one web application.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Create an account
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Platform capabilities</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
          Designed around clear roles and controlled access
        </h2>
        <p className="mt-4 leading-7 text-slate-600">
          The application demonstrates how different users interact with a shared service while
          keeping account approval and administrative permissions separate.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.number} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <p className="text-sm font-bold tracking-widest text-emerald-700">{feature.number}</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">How it works</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">A simple, role-based journey</h2>
        </div>
        <ol className="space-y-5 text-slate-200">
          <li><strong className="text-white">1. Register.</strong> Patients can create an account; doctor applications enter a pending review state.</li>
          <li><strong className="text-white">2. Review.</strong> An administrator reviews doctor applications and manages account status.</li>
          <li><strong className="text-white">3. Connect.</strong> Approved patients and doctors can access private messaging.</li>
        </ol>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-amber-950">Demonstration project notice</h2>
        <p className="mt-2 leading-7 text-amber-900">
          This application is a software portfolio demonstration, not a medical service.
          Do not submit real medical records or rely on it for diagnosis, treatment, or emergency care.
          Use synthetic information only.
        </p>
      </div>
    </section>
  </div>
);

export default Home;
