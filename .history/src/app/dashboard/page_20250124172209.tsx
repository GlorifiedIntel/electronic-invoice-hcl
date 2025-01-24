import { CirclePlus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { Invoices, Customers } from '@/db/schema';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import Container from '@/components/Container'
  import Link from 'next/link';
  import { cn } from "@/lib/utils"

  


export default async function DashboardPage() {
  const { userId} = await auth()

  if (!userId) {
    return;
  }

  let  results;
  
  if (orgId) {
    results = await db.select()
  .from(Invoices)
  .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
  .where(eq(Invoices.userId, userId))
  } else {
    results = await db.select()
  .from(Invoices)
  .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
  .where(eq(Invoices.userId, userId))
  }
  
  
  ;


  console.log('results', results)
 return (
      <main className="h-full dashboardContainer">
      <Container>
      <div className="flex justify-between">
      <h1 className="text-3xl font-bold text-left">
        Invoices
        </h1>
        <p>
        <Button className="inline-flex gap-2" variant="ghost" asChild>
          <Link href="/invoices/new">
        <CirclePlus className="h-4 w-4" />
          Create Invoice
          </Link>
        </Button>
        </p>
      </div>

      
  <Table>
  <TableCaption>A list of your recent invoices.</TableCaption> 
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px] p-4">Date</TableHead>
      <TableHead className="p-4">Customer Name</TableHead>
      <TableHead className="p-4">Address</TableHead>
      <TableHead className="p-4">Email</TableHead>
      <TableHead className="p-4">Phone Number</TableHead>
      <TableHead className="text-center p-4">Status</TableHead>
      <TableHead className="text-right p-4">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {results.map(result => {
    return (
      <TableRow key={result.invoices.id}>
      <TableCell className="font-medium text-left p-0">
        <Link href={`/invoices/${result.invoices.id}`} className="font-semibold block p-4">
          {new Date(result.invoices.createTs).toLocaleDateString()}
        </Link>
      </TableCell>
      
      <TableCell className="text-left p-0">
        <Link href={`/invoices/${result.customers.id}`} className="font-semibold block p-4" >
          {result.customers.billingName}
        </Link>
      </TableCell>
      
      <TableCell className="text-left p-0">
        <Link href={`/invoices/${result.customers.id}`} className="font-semibold block p-4">
          {result.customers.billingAddress}
        </Link>
      </TableCell>

      
      <TableCell className="text-left p-0">
        <Link href={`/invoices/${result.customers.id}`} className="block p-4">
          {result.customers.billingEmail}
        </Link>
      </TableCell>

      
      <TableCell className="text-left p-0">
        <Link href={`/invoices/${result.customers.id}`} className="font-semibold block p-4">
          {result.customers.phoneNumber}
        </Link>
      </TableCell>

      
      <TableCell className="text-center p-0">
        <Link href={`/invoices/${result.invoices.id}`} className="block p-4">
          <Badge className={cn(
                  "rounded-full capitalize",
                  result.invoices.status === 'open' && 'bg-blue-500',
                  result.invoices.status === 'paid' && 'bg-green-600',
                  result.invoices.status === 'void' && 'bg-zinc-700',
                  result.invoices.status === 'uncollectible' && 'bg-red-600'
                  )}>{result.invoices.status}
                </Badge>
        </Link>
      </TableCell>

     
      <TableCell className="text-right p-0">
        <Link href={`/invoices/${result.invoices.id}`} className="font-semibold block p-4">
          &#8358;{(result.invoices.amount / 100).toFixed(2)}
        </Link>
      </TableCell>
    </TableRow>
    )
  })}
  </TableBody>
</Table>
</Container>
</main>

);
}
