import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import API from "../api";
import { useForm } from "../hooks/useForm";
import { rules } from "../utils/validation";
import FormField from "../components/ui/FormField";
import FormAlert from "../components/ui/FormAlert";
import SubmitButton from "../components/ui/SubmitButton";
import { FaStar, FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

const registerSchema = {
  name: [rules.required, rules.minLength(2, "Name must be at least 2 characters")],
  email: [rules.required, rules.email],
  password: [rules.required, rules.password],
};

function Register() {
  const {
    values,
    errors,
    touched,
    submitting,
    formMessage,
    setField,
    blurField,
    handleSubmit,
  } = useForm({ name: "", email: "", password: "" }, registerSchema);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await API.post("/auth/register", data);
      toast.success("Account created! Please sign in.");
      window.location.href = "/login";
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Registration failed. This email may already be in use.";
      throw new Error(msg);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 mb-4">
            <FaStar className="text-white text-xl" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-2 text-sm">Start planning your events with SLV Events</p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <FormAlert message={formMessage} variant="auth" />

          <FormField
            variant="auth"
            label="Full name"
            name="name"
            type="text"
            icon={FaUser}
            placeholder="Your full name"
            value={values.name}
            onChange={setField}
            onBlur={blurField}
            error={errors.name}
            touched={touched.name}
            required
          />

          <FormField
            variant="auth"
            label="Email address"
            name="email"
            type="email"
            icon={FaEnvelope}
            placeholder="you@example.com"
            value={values.email}
            onChange={setField}
            onBlur={blurField}
            error={errors.email}
            touched={touched.email}
            required
          />

          <FormField
            variant="auth"
            label="Password"
            name="password"
            type="password"
            icon={FaLock}
            placeholder="••••••••"
            value={values.password}
            onChange={setField}
            onBlur={blurField}
            error={errors.password}
            touched={touched.password}
            hint="Use at least 6 characters"
            required
          />

          <SubmitButton
            loading={submitting}
            loadingText="Creating account…"
            className="w-full btn btn-primary btn-lg mt-1"
          >
            <FaUserPlus /> Create Account
          </SubmitButton>

          <p className="text-center text-sm text-slate-400 pt-1">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
