"use client";

import React from 'react'
import { TSignInSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

const page = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
    setError,
  } = useForm<TSignInSchema>({
     resolver: zodResolver(signInSchema)
   });

  const onSubmit = async (data: TSignInSchema) => {
    const response = await fetch('/api/signup', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
    });

    const responseData = await response.json();

    if(!response.ok){
      alert("Submitting form failed!");
      return;
    }

    

  return (
    <div>

    </div>
  )
}

export default page