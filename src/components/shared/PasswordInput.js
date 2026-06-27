"use client";

import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({
  value,
  onChange,
  name = "password",
  placeholder = "Password",
  ...rest
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="input input-bordered flex items-center gap-2">
      <FiLock className="text-base-content/40" />
      <input
        type={visible ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className="grow"
        value={value}
        onChange={onChange}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-base-content/40 hover:text-base-content"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </label>
  );
}
