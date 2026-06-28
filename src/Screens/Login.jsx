import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import API from "../api";
import { useForm } from "../hooks/useForm";
import { rules } from "../utils/validation";
import FormField from "../components/ui/FormField";
import FormAlert from "../components/ui/FormAlert";
import SubmitButton from "../components/ui/SubmitButton";
import { FaStar, FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const loginSchema = {
  email: [rules.required, rules.email],
  password: [rules.required, rules.password],
};

function Login() {
  const {
    values,
    errors,
    touched,
    submitting,
    formMessage,
    setField,
    blurField,
    handleSubmit,
  } = useForm({ email: "", password: "" }, loginSchema);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back! Login successful.");
      window.location.href = "/";
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      throw new Error(msg);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
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
          <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to your SLV Events dashboard</p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <FormAlert message={formMessage} variant="auth" />

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
            hint="Use the email you registered with"
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
            hint="Minimum 6 characters"
            required
          />

          <SubmitButton
            loading={submitting}
            loadingText="Signing in…"
            className="w-full btn btn-primary btn-lg mt-1"
          >
            <FaSignInAlt /> Sign In
          </SubmitButton>

          <p className="text-center text-sm text-slate-400 pt-1">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Create account
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
