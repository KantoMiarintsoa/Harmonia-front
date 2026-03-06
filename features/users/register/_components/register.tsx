import React from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">

      <Card className="bg-white w-[380px] rounded-2xl shadow-2xl p-8 border-0">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 font-semibold tracking-wide">
            HARMONIA
          </h2>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please fill in the information below
          </p>
        </div>

        <form className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />

          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />

          <input
            type="password"
            placeholder="••••••••"
            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />

          <button
            type="submit"
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Sign Up
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Sign up with Google
          </button>

        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/protected/dashboard" className="text-purple-600 cursor-pointer hover:underline">
            Sign in
          </Link>
        </div>

      </Card>
    </div>
  )
}

export default Register
