import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminOverview, getAdminUsers, updateDoctorStatus, updateUserStatus } from "../services/api";

const statusClass = { pending: "bg-amber-100 text-amber-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800", suspended: "bg-gray-200 text-gray-800" };

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const visibleUsers = useMemo(() => users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "pending") return user.role === "doctor" && user.status === "pending";
    return user.role === filter;
  }), [users, filter]);

  const refresh = async () => {
    const [stats, list] = await Promise.all([getAdminOverview(), getAdminUsers()]);
    setOverview(stats);
    setUsers(list);
  };

  useEffect(() => {
    if (!token || role !== "admin") return;
    refresh().catch((err) => setError(err.response?.data?.message || "Unable to load administrator dashboard."))
      .finally(() => setLoading(false));
  }, [token, role]);

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  const changeStatus = async (user, status) => {
    setBusyId(user._id); setError(""); setNotice("");
    try {
      if (user.role === "doctor") await updateDoctorStatus(user._id, status);
      else await updateUserStatus(user._id, status);
      await refresh();
      setNotice(`${user.name}'s account is now ${status}.`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update this account.");
    } finally { setBusyId(""); }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-green-700">Health Consult</p><h1 className="text-3xl font-bold text-slate-900">Administrator dashboard</h1><p className="mt-1 text-slate-600">Review doctor applications and manage platform accounts.</p></div>
          <button onClick={() => { setLoading(true); refresh().catch((err) => setError(err.response?.data?.message || "Refresh failed.")).finally(() => setLoading(false)); }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-100">Refresh</button>
        </div>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-green-800">{notice}</p>}
        {loading ? <p className="py-12 text-center text-slate-600">Loading dashboard…</p> : <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[[ "Pending doctors", overview?.doctorsPending ?? 0 ],[ "Approved doctors", overview?.doctorsApproved ?? 0 ],[ "Active patients", overview?.patients ?? 0 ],[ "Suspended accounts", overview?.suspended ?? 0 ]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}
          </div>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold text-slate-900">User accounts</h2><select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2"><option value="all">All accounts</option><option value="pending">Pending doctor applications</option><option value="doctor">Doctors</option><option value="patient">Patients</option></select></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
              <thead><tr className="border-b text-slate-500"><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Status</th><th className="py-3">Actions</th></tr></thead>
              <tbody>{visibleUsers.map((user) => <tr key={user._id} className="border-b last:border-0"><td className="py-4 pr-4 font-medium text-slate-900">{user.name}</td><td className="py-4 pr-4 text-slate-600">{user.email}</td><td className="py-4 pr-4 capitalize">{user.role}</td><td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[user.status] || statusClass.suspended}`}>{user.status}</span></td><td className="py-4"><div className="flex flex-wrap gap-2">
                {user.role === "doctor" && user.status === "pending" && <><button disabled={busyId === user._id} onClick={() => changeStatus(user, "approved")} className="rounded-md bg-green-600 px-3 py-1.5 text-white disabled:opacity-50">Approve</button><button disabled={busyId === user._id} onClick={() => changeStatus(user, "rejected")} className="rounded-md bg-red-600 px-3 py-1.5 text-white disabled:opacity-50">Reject</button></>}
                {user.status !== "suspended" && user.status !== "rejected" && <button disabled={busyId === user._id} onClick={() => changeStatus(user, "suspended")} className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 disabled:opacity-50">Suspend</button>}
                {user.status === "suspended" && <button disabled={busyId === user._id} onClick={() => changeStatus(user, "approved")} className="rounded-md border border-green-600 px-3 py-1.5 text-green-700 disabled:opacity-50">Reactivate</button>}
              </div></td></tr>)}
              {visibleUsers.length === 0 && <tr><td colSpan="5" className="py-10 text-center text-slate-500">No accounts found for this filter.</td></tr>}</tbody>
            </table></div>
          </section>
        </>}
      </div>
    </div>
  );
}
