"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { Invoices, Status, Customers } from '@/db/schema';
import { eq, and } from "drizzle-orm";


export async function createAction(formData: FormData) {
  const { userId } = await auth()
  const status = formData.get("status") as "open" | "paid" | "void" | "uncollectible";

  if (!userId) {
    return;
  }

  const amount = Math.floor(parseFloat(String(formData.get('amount'))) * 100);
  const description = formData.get('description') as string;
  const billingName = formData.get('billingName') as string;
  const billingAddress = formData.get('billingAddress') as string;
  const billingEmail = formData.get('billingEmail') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
 
  const [customer] = await db.insert(Customers)
    .values({
      userId,
      billingName,
      billingAddress,
      billingEmail,
      phoneNumber,
      description
    })
    .returning({
      id: Customers.id, 
    });

    const results = await db.insert(Invoices)
    .values({
      userId,
      amount,
      description,
      customerId: customer.id,
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

export async function deleteInvoiceAction(formData: FormData) {
  const authResult = await auth(); 
  const { userId } = authResult; 
  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;
  
  await db.delete(Invoices)
        .where(
      and(
        eq(Invoices.id, parseInt(id)),
        eq(Invoices.userId, userId)
      )
    )

  redirect('/dashboard');
}

