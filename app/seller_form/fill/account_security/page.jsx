"use client"

import { useSellerForm } from '@/app/context/SellerFormContext'
import AccountDetails from '@/components/account'
import React from 'react'

const page = () => {
    const {formData , updateFormData ,calculateCompletion} = useSellerForm();
  return (
    <div className='lg:p-12 p-2'>
      <AccountDetails formData={formData} updateFormData={updateFormData}/>
    </div>
  )
}

export default page
