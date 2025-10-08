import React from "react";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        
        <form className="space-y-4">
          <input type="text" placeholder="Username" className="input" />
          <input type="email" placeholder="Email" className="input" />
          <input type="tel" placeholder="Phone" className="input" />
          <input type="password" placeholder="Password" className="input" />

          {/* Optional audit fields */}
          <input type="text" placeholder="Created By" className="input" disabled />
          <input type="datetime-local" placeholder="Created At" className="input" disabled />
          <input type="text" placeholder="Updated By" className="input" disabled />
          <input type="datetime-local" placeholder="Updated At" className="input" disabled />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
