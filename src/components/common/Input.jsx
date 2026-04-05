// src/components/common/Input.jsx
const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 border rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error 
            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
            : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;