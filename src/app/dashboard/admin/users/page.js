"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiUserX,
  FiUserCheck,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import api from "@/lib/api";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    api
      .get("/users")
      .then(({ data }) => setUsers(data.data || []))
      .catch((error) => console.error("Failed to load users:", error.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setActioningId(user._id);
    try {
      await api.patch(`/users/${user._id}/status`, { status: newStatus });
      toast.success(`User ${newStatus}.`);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user status.",
      );
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this user? This cannot be undone."))
      return;
    setActioningId(id);
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted.");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setActioningId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">Manage Users</h1>
      <p className="mt-1 text-base-content/60">
        View, suspend, or remove platform users
      </p>

      <label className="input input-bordered mt-4 flex max-w-sm items-center gap-2">
        <FiSearch className="text-base-content/40" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {isLoading ? (
        <div className="mt-8 flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-box border border-base-200 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td className="font-medium">{u.name}</td>
                  <td className="text-sm text-base-content/60">{u.email}</td>
                  <td>
                    <span className="badge badge-outline capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === "active" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="text-sm text-base-content/50">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        className="btn btn-ghost btn-sm btn-circle"
                        disabled={actioningId === u._id || u.role === "admin"}
                        onClick={() => handleToggleStatus(u)}
                        title={u.status === "active" ? "Suspend" : "Reactivate"}
                      >
                        {u.status === "active" ? (
                          <FiUserX size={14} className="text-warning" />
                        ) : (
                          <FiUserCheck size={14} className="text-success" />
                        )}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-circle"
                        disabled={actioningId === u._id || u.role === "admin"}
                        onClick={() => handleDelete(u._id)}
                      >
                        <FiTrash2 size={14} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <FiUsers size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">
            No users found
          </p>
        </div>
      )}
    </div>
  );
}
