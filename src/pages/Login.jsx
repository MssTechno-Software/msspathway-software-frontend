import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

function Login() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [invalidPopup, setInvalidPopup] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9_]+@msstechno\.com$/;
    return emailRegex.test(value);
  };

  const handleSignIn = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Please enter email");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Error in email account");
      valid = false;
    }

    if (!password) {
      setPasswordError("Please enter password");
      valid = false;
    }

    if (!valid) return false;

    return true;
  };

  // api
  const loginHandler = async (e) => {
    console.log("Hello",email);
    e.preventDefault();

    const isValid = handleSignIn();
    if (!isValid) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "https://timesheet-api-790373899641.asia-south1.run.app/auth/login",
        
        {
          email: email,
          password: password,
        }
      );

      console.log("Login Success:", response.data);

      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      // Optional: store token if API returns it
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      if (response.data.user_id) {
        localStorage.setItem("user_id", response.data.user_id);
      } else if (response.data.user?.id) {
        localStorage.setItem("user_id", response.data.user.id);
      }

      navigate("/dashboard");

    } catch (error) {
        console.error("Login Error:", error);
        setInvalidPopup(true);
    }
      finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center relative overflow-hidden px-4">
      <img src="./watermark.png" alt="Watermark" className="absolute w-200 opacity-40" />
      <img src="./textMSS.png" alt="Text Logo" className="absolute w-200" />
      <div className="absolute top-25 text-center">
        <img
          src="./logo.png"
          alt="Company Logo"
          className="w-40 mx-auto"
        />
      </div>
      
      {/* Login Card */}
      <form
        onSubmit={loginHandler}
        className="relative bg-white w-full max-w-sm sm:max-w-90 p-6 sm:p-8 rounded-xl shadow-2xl"
      >

        {/* Email */}
        <label className="text-sm font-semibold text-gray-700 tracking-wide">
          EMAIL ID
        </label>
        <div className={`flex items-center border rounded-lg mt-1 mb-3 px-3 ${
          emailError ? "border-red-500" : "border-gray-300"
        }`}>
          <FiMail className="text-gray-400 mr-2" />
          <input
            type="email"
            placeholder="you@msstechno.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className="w-full py-2 outline-none text-sm"
          />
        </div>

        {emailError && (
          <p className="text-red-500 text-xs text-left">
            {emailError}
          </p>
        )}

        {/* Password */}
        <label className="text-sm font-semibold text-gray-700 tracking-wide">
          PASSWORD
        </label>
        <div className={`flex items-center border rounded-lg mt-1 mb-1 px-3 ${
          passwordError ? "border-red-500" : "border-gray-300"
        }`}>
          <FiLock className="text-gray-400 mr-2 shrink-0" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            className="w-full py-2 outline-none text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 ml-2"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {passwordError && (
          <p className="text-red-500 text-xs text-left">
            {passwordError}
          </p>
        )}

        <p
          className="text-left text-sm text-green-600 cursor-pointer hover:underline mb-6"
          onClick={() => setShowPopup(true)}
        >
          Forgot password?
        </p>

        <button
          type="submit"
          className="w-full py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition text-sm"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Forgot Password Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-xs sm:max-w-[320px] p-5 sm:p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Access Denied
            </h3>
            <p className="text-gray-600 text-sm">
              You don’t have access to reset the password.
              Please contact the admin.
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-5 px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Invalid Credentials Popup */}
      {invalidPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-xs sm:max-w-[320px] p-5 sm:p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Login Failed
            </h3>
            <p className="text-gray-600 text-sm">
              Invalid email or password. Please try again.
            </p>

            <button
              onClick={() => setInvalidPopup(false)}
              className="mt-5 px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
