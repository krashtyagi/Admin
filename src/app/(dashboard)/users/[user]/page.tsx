'use client'
import { useParams } from 'next/navigation';
import React from 'react'
import { useUser } from '../_calls/queryies';
import { BookingsDataTable } from '../_components/allDestinations';
import { PageSkeleton } from '@/components/loaders/loader/skeleton';
export interface Booking {
  _id: string;
  bookingReference: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  createdAt: string;
  serviceType: string;
  name: string; // Property Name
  city: string;
  image: string;
}
type Props = {}

const User = (props: Props) => {
  const {user} = useParams();
      const id = Array.isArray(user)
      ? user[0]
      : user || "";
  const {data, isLoading} = useUser(id)
  return (
    <div>
      {
        isLoading?<PageSkeleton/>:(
    <BookingsDataTable bookings={data?.data?.data?.bookings || []}/>

        )
      }
    </div>
  )
}

export default User