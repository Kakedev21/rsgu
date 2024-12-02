"use client"

import React, { Suspense } from 'react'
import { useEffect, useState } from 'react';
import useUser from '@/hooks/useUser';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const userHook = useUser({ init: false })

  const [message, setMessage] = useState('loading');
  const [loading, setLoading] = useState(false)

  const handleConfirmEmail = async (token: string) => {
    setLoading(true)
    try {
      const result = await userHook.confirmEmail(token)
      if (result.status === 200) {
        setMessage("Success")
      } else {
        setMessage(result.message || 'Failed to verify email.');
      }
    } catch (error) {
      setMessage('An error occurred while verifying the email.');
    }
    setLoading(false)
  }

  useEffect(() => {
    if (token) handleConfirmEmail(token as string)
  }, [token])

  return (
    <div className="w-full h-screen bg-white relative">
      <div className=" h-1/2 bg-red-500 rounded-b-3xl" />
      <div className="flex flex-col justify-center items-center absolute z-50 top-[5%] w-full r-0 l-0">
        <Image
          src="/rgo_logo.png"
          width={200}
          height={200}
          alt="Authentication"
          className="block w-32 h-32 sm:w-[210px] sm:h-[200px] text-center"
        />
        <div className="container mx-auto text-center mt-10">
          {message === 'loading' ? <p>Verifying your email...</p> : (
            <p className='text-green-600'>Email Verified,You may now login</p>
          )}
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  )
}

export default Page