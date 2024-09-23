import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register({ name, email, password, position });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
    }
  };

  const formFields = [
    {
      label: "Name",
      type: "text",
      value: name,
      setValue: setName,
      placeholder: "Enter your name",
      required: true,
    },
    {
      label: "Email",
      type: "email",
      value: email,
      setValue: setEmail,
      placeholder: "Enter your email",
      required: true,
    },
    {
      label: "Password",
      type: "password",
      value: password,
      setValue: setPassword,
      placeholder: "Enter your password",
      required: true,
    },
    {
      label: "Confirm Password",
      type: "password",
      value: confirmPassword,
      setValue: setConfirmPassword,
      placeholder: "Confirm your password",
      required: true,
    },
    {
      label: "Position",
      type: "text",
      value: position,
      setValue: setPosition,
      placeholder: "Enter your position",
      required: false,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          {formFields.map((field, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700 font-semibold mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                required={field.required}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-left">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
