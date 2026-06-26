"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiFileText, FiPlus, FiTrash2, FiEdit3, FiX } from "react-icons/fi";
import api from "@/lib/api";

const emptyMedication = { name: "", dosage: "", frequency: "", duration: "" };

function PrescriptionsContent() {
  const searchParams = useSearchParams();
  const prefilledAppointmentId = searchParams.get("appointmentId") || "";

  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!prefilledAppointmentId);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    appointmentId: prefilledAppointmentId,
    diagnosis: "",
    notes: "",
    medications: [{ ...emptyMedication }],
  });

  const fetchPrescriptions = useCallback(() => {
    setIsLoading(true);
    api
      .get("/prescriptions/doctor")
      .then(({ data }) => setPrescriptions(data.data || []))
      .catch((error) =>
        console.error("Failed to load prescriptions:", error.message),
      )
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const resetForm = () => {
    setForm({
      appointmentId: "",
      diagnosis: "",
      notes: "",
      medications: [{ ...emptyMedication }],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const updateMedication = (index, field, value) => {
    setForm((f) => {
      const meds = [...f.medications];
      meds[index] = { ...meds[index], [field]: value };
      return { ...f, medications: meds };
    });
  };

  const addMedicationRow = () => {
    setForm((f) => ({
      ...f,
      medications: [...f.medications, { ...emptyMedication }],
    }));
  };

  const removeMedicationRow = (index) => {
    setForm((f) => ({
      ...f,
      medications: f.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      diagnosis: form.diagnosis,
      notes: form.notes,
      medications: form.medications.filter((m) => m.name.trim()),
    };

    try {
      if (editingId) {
        await api.patch(`/prescriptions/${editingId}`, payload);
        toast.success("Prescription updated.");
      } else {
        await api.post("/prescriptions", {
          ...payload,
          appointmentId: form.appointmentId,
        });
        toast.success("Prescription created.");
      }
      resetForm();
      fetchPrescriptions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save prescription.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (prescription) => {
    setForm({
      appointmentId: prescription.appointmentId,
      diagnosis: prescription.diagnosis,
      notes: prescription.notes || "",
      medications:
        prescription.medications?.length > 0
          ? prescription.medications
          : [{ ...emptyMedication }],
    });
    setEditingId(prescription._id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Prescriptions
          </h1>
          <p className="mt-1 text-base-content/60">
            Create and manage prescriptions for completed appointments
          </p>
        </div>
        {!showForm && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(true)}
          >
            New Prescription
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 rounded-box border border-base-200 bg-base-100 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base-content">
              {editingId ? "Edit Prescription" : "New Prescription"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <FiX size={16} />
            </button>
          </div>

          {!editingId && (
            <label className="form-control">
              <span className="label-text text-xs">Appointment ID</span>
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Appointment ID (must be marked completed)"
                value={form.appointmentId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, appointmentId: e.target.value }))
                }
                required
              />
            </label>
          )}

          <label className="form-control">
            <span className="label-text text-xs">Diagnosis</span>
            <textarea
              className="textarea textarea-bordered h-20"
              value={form.diagnosis}
              onChange={(e) =>
                setForm((f) => ({ ...f, diagnosis: e.target.value }))
              }
              required
            />
          </label>

          <div>
            <span className="label-text text-xs">Medications</span>
            <div className="mt-2 flex flex-col gap-2">
              {form.medications.map((med, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <input
                    placeholder="Name"
                    className="input input-bordered input-sm sm:col-span-2"
                    value={med.name}
                    onChange={(e) =>
                      updateMedication(i, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="Dosage"
                    className="input input-bordered input-sm"
                    value={med.dosage}
                    onChange={(e) =>
                      updateMedication(i, "dosage", e.target.value)
                    }
                  />
                  <input
                    placeholder="Frequency"
                    className="input input-bordered input-sm"
                    value={med.frequency}
                    onChange={(e) =>
                      updateMedication(i, "frequency", e.target.value)
                    }
                  />
                  <div className="flex gap-1">
                    <input
                      placeholder="Duration"
                      className="input input-bordered input-sm flex-1"
                      value={med.duration}
                      onChange={(e) =>
                        updateMedication(i, "duration", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-circle text-error"
                      onClick={() => removeMedicationRow(i)}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMedicationRow}
              className="btn btn-ghost btn-sm mt-2 gap-1"
            >
              <FiPlus size={14} /> Add medication
            </button>
          </div>

          <label className="form-control">
            <span className="label-text text-xs">Notes (optional)</span>
            <textarea
              className="textarea textarea-bordered h-16"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isSubmitting}
          >
            {editingId ? "Update Prescription" : "Create Prescription"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="mt-8 flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="mt-6 flex flex-col gap-3">
          {prescriptions.map((p) => (
            <div
              key={p._id}
              className="rounded-box border border-base-200 bg-base-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-base-content">
                    {p.patientId?.name}
                  </p>
                  <p className="text-sm text-base-content/60">{p.diagnosis}</p>
                </div>
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => handleEdit(p)}
                >
                  <FiEdit3 size={14} />
                </button>
              </div>
              {p.medications?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.medications.map((med, i) => (
                    <span key={i} className="badge badge-outline">
                      {med.name} — {med.dosage}, {med.frequency}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
            <FiFileText size={32} className="text-base-content/30" />
            <p className="mt-3 font-medium text-base-content/70">
              No prescriptions yet
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default function PrescriptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-base-content/50">Loading...</div>
      }
    >
      <PrescriptionsContent />
    </Suspense>
  );
}
