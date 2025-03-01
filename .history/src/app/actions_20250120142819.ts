"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { Invoices, Status } from '@/db/schema';
import { eq, and } from "drizzle-orm";


export async function createAction(formData: FormData) {
  const { userId } = await auth()
  // Parse the amount, removing non-numeric characters if necessary
  const amount = Math.floor(parseFloat(String(formData.get('amount'))) * 100);
  const description = formData.get('description') as string;
  const billingName = formData.get('billingName') as string;
  const billingAddress = formData.get('billingAddress') as string;
  const billingEmail = formData.get('billingEmail') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const status = formData.get("status") as "open" | "paid" | "void" | "uncollectible";

  if (!userId) {
    return;
  }
    
 const results = await db.insert(Invoices)
    .values({
      userId,
      billingName,
      billingAddress,
      billingEmail,
      phoneNumber,
      amount,
      description,
      status,
      
      
    })
    .returning({
      id: Invoices.id, 
    });

  
  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const authResult = await auth(); 
  const { userId } = authResult; 
  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  await db.update(Invoices)
    .set({ status })
    .where(
      and(
        eq(Invoices.id, parseInt(id)),
        eq(Invoices.userId, userId)
      )
    )

  revalidatePath('/invoices/${id}', 'page')
}