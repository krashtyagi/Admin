'use client'
import React from 'react'
import { useAllUsers } from './_calls/queryies'
import { UsersDataTable } from './_components/userstable';
export interface User {
  _id: string;
  isActive: boolean;
  createdAt: string; 
  totalBookings: number;
  
  phoneNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: Pagination;
  };
}
type Props = {}

const page = (props: Props) => {
  const {data:d} = useAllUsers()
  const data = d?.data as ApiResponse
  return (
    <div>
    <UsersDataTable users={data?.data?.users || []}/>

    </div>
  )
}

export default page 