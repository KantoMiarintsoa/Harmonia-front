import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Apple } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">

      <Card className="bg-white w-[380px] rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 font-semibold tracking-wide">
            HARMONIA
          </h2>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please enter your login credentials
          </p>
        </div>

        <form className="space-y-4">

          <Input 
            type="email"
            placeholder="example@gmail.com"
            className="h-11"
          />

          <Input 
            type="password"
            placeholder="••••••••"
            className="h-11"
          />

          <div className="text-right text-xs text-purple-600 cursor-pointer">
            Forgot password?
          </div>

         <Link href="/unauthenticated/dashboard" className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center rounded-md">
            Login
          </Link>

          <div className="flex items-center gap-3 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400">or</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-2"
          >
            <Apple className="w-4 h-4" />
            Sign in with Apple ID
          </Button>

        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link href="/unauthenticated/register" className="text-purple-600 cursor-pointer">
            Sign up
          </Link>
        </div>

      </Card>
    </div>
  )
}

export default Login
