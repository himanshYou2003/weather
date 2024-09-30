import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform sign-in
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/", // Redirect to home page after sign-in
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok && result.url) {
      // Log success and redirect
      router.push(result.url); // Ensure this URL is correct
    } else {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <label className="block mb-4">
          <span className="block text-sm font-medium">Email:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-700 rounded bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </label>
        <label className="block mb-4">
          <span className="block text-sm font-medium">Password:</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-700 rounded bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition duration-200"
        >
          Sign In
        </button>
      </form>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      <Link href="/auth/signup" className="mt-4 text-blue-400 hover:underline">
        Create an account
      </Link>
    </div>
  );
}
