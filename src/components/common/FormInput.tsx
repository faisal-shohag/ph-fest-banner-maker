import { Eye, EyeOff } from "lucide-react";

const FormInput = ({ icon: Icon, type = "text", error, showPassword, onTogglePassword, ...props } : any) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type === "password" && showPassword ? "text" : type}
      className={`w-full pl-10 pr-${type === "password" ? "12" : "4"} py-3 bg-white/10 backdrop-blur-sm border ${
        error ? 'border-red-400' : 'border-white/20'
      } rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200`}
      {...props}
    />
    {type === "password" && (
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    )}
  </div>
);

export default FormInput;