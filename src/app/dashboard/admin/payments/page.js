"use client";

import { useState, useEffect } from "react";
import { FiCreditCard } from "react-icons/fi";
import api from "@/lib/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/payments")
      .then(({ data }) => setPayments(data.data || []))
      .catch((error) => console.error("Failed to load payments:", error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">Payment Records</h1>
      <p className="mt-1 text-base-content/60">All transactions processed on the platform</p>

      <div className="mt-6 rounded-box border border-base-200 bg-base-100 p-5">
        <p className="text-sm text-base-content/60">Total Platform Revenue</p>
        <p className="text-3xl font-bold text-primary">${total.toFixed(2)}</p>
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : payments.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-box border border-base-200 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.patientId?.name}</td>
                  <td>Dr. {p.doctorId?.doctorName}</td>
                  <td className="font-semibold text-primary">${p.amount}</td>
                  <td className="text-xs text-base-content/50">{p.transactionId}</td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <FiCreditCard size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">No payments yet</p>
        </div>
      )}
    </div>
  );
}