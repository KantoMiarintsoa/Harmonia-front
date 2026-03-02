import { Header } from '@/components/layout/header'
import Login from '@/features/auth/_components/login'
import React from 'react'

function HomePage() {
  return (
    <div>
      <Login/>
    </div>
  )
}

export default HomePage


// export default async function Home() {
//   const user = await getCurrentUser()

//   if (user) {
//     redirect("/dashboard")
//   } else {
//     redirect("/login")
//   }
// }