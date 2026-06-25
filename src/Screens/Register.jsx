import { useState } from "react";
import API from "../api";

function Register() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert(
        "Registration Successful"
      );

      window.location.href =
        "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
          required
        />

        <button
          className="bg-green-600 text-white w-full p-3 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;