import { use, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowRight, Camera, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "@/contexts-providers/auth-context";
import FormInput from "@/components/common/FormInput";


// Zod schema for login form validation
const signupSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  photoURL: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});




export const Signup = () => {
 const { signup } = use(AuthContext) as any;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", photoURL: "", displayName: "" },
  });

  const onSubmit = async (data) => {
    try {
      const response = await signup(data.displayName, data.email, data.password, data.photoURL);
      if (response.success) navigate("/");
      else {
        console.log(response.data?.error);
        toast.error(response.data?.error || "Login failed!");
      }
    } catch (err:any) {
      toast.error(err.response?.data?.message || "Login failed!");
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-300">Join us today</p>
          </div>

          {errors.root && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
              <p className="text-red-300 text-sm">{errors.root.message}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <FormInput
                icon={User}
                type="text"
                placeholder="Display Name"
                error={errors.displayName}
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-300">{errors.displayName.message}</p>
              )}
            </div>

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

            <div>
              <FormInput
                icon={Camera}
                type="url"
                placeholder="Photo URL (optional)"
                error={errors.photoURL}
                {...register('photoURL')}
              />
              {errors.photoURL && (
                <p className="mt-1 text-sm text-red-300">{errors.photoURL.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to={'/auth/login'}><button className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors">
                Sign in
              </button></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup