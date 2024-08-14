import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For registration
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegistering) {
      // Registration logic
      if (!email || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Retrieve existing users from local storage or initialize an empty array
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      
      // Check if the email is already registered
      const userExists = storedUsers.some(user => user.email === email);
      if (userExists) {
        setError("Email is already registered.");
        return;
      }

      // Add new user to the array
      storedUsers.push({ email, password });
      localStorage.setItem("users", JSON.stringify(storedUsers));

      // Clear fields and switch to login mode
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsRegistering(false);
      setError("");
    } else {
      // Login logic
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      // Retrieve users from local storage
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Verify credentials
      const user = storedUsers.find(user => user.email === email && user.password === password);
      if (user) {
        // On successful login
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        router.push("/home");
      } else {
        setError("Invalid email or password.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex justify-center py-4 bg-gray-200 dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Stock Market Data Analysis
        </h1>
      </div>

      <div className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-medium text-center text-gray-600 dark:text-gray-200 mb-2">
            {isRegistering ? "Create an Account" : "Welcome Back"}
          </h3>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-1 mb-4">
            {isRegistering ? "Register to create an account" : "Login to your account"}
          </p>

          {error && (
            <p className="text-red-500 text-center mt-2">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <input
                className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegistering && (
              <div className="mb-4">
                <input
                  className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
                  type="password"
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
              >
                Forget Password?
              </a>

              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium tracking-wide text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                {isRegistering ? "Register" : "Sign In"}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-700 mt-4 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-200">
              {isRegistering ? "Already have an account?" : "Don't have an account? "}
            </span>
            <a
              href="#"
              className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </a>
          </div>
        </div>
      </div>

      <footer className="bg-gray-200 dark:bg-gray-800 py-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400">We would love to hear from you!</p>
          <div className="mt-4">
            <p className="text-gray-600 dark:text-gray-400"><strong>Email:</strong> demo@example.com</p>
            <p className="text-gray-600 dark:text-gray-400"><strong>Phone:</strong> (123) 456-7890</p>
            <p className="text-gray-600 dark:text-gray-400"><strong>Address:</strong> 1234 Stock Market Ave, Fin City, FC 56789</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
