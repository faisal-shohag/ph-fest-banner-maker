import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/common/FormInput";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "@/contexts-providers/auth-context";


// Zod schema for login form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});




export const Login = () => {
  const { login } = use(AuthContext) as any;
  const navigate = useNavigate();
  const location:any = useLocation()

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      if (response.success) navigate(location?.pathName || '/');
      else {
        console.log(response.data?.error);
        toast.error(response.data?.error || "Login failed!");
      }
    } catch (err:any) {
      toast.error(err.response?.data?.message || "Login failed!");
    }
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          {errors.root && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
              <p className="text-red-300 text-sm">{errors.root.message}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <FormInput
                icon={Mail}
                type="email"
                placeholder="Email address"
                error={errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
              )}
            </div>

            <div>
              <FormInput
                icon={Lock}
                type="password"
                placeholder="Password"
                error={errors.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
                <Link to={'/auth/signup'}><button className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors">
                Sign up
              </button></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login