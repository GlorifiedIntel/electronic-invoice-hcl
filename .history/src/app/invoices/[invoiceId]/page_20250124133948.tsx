import { notFound } from 'next/navigation';
import Image from 'next/image';
import { eq, and } from "drizzle-orm";
import { auth } from '@clerk/nextjs/server';
import { ChevronDown, Ellipsis, Trash2 } from 'lucide-react';
import { db } from '@/db';
import { Invoices } from '@/db/schema';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Container from '@/components/Container';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from '@/data/invoices';
import { updateStatusAction, deleteInvoiceAction } from '@/app/actions';

export default async function InvoicePage({ params }: { params: { invoiceId: string } }) {
  const { userId } = await auth();
  
  if (!userId) {
    return;
  }
  const resolvedParams = await params;
  const invoiceId = parseInt(resolvedParams.invoiceId, 10);
  
  if (isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID');
  }

  const [result] = await db.select()
    .from(Invoices)
    .where(
      and(
      eq(Invoices.id, invoiceId),
      eq(Invoices.userId, userId)
   ))
     
    .limit(1);

  if (!result) {
    notFound();
  }

  // Company Info
  const companyInfo = {
    name: "Happiness Computers Limited",
    address: "Suite 15 & 22, Zone 3 Shopping Complex, Wuse, Abuja",
    phoneNumber: "08036046736; 08032949083",
    email: "happinesscomputer2020@gmail.com",
    logoUrl: "/hclogo.png",  
  };

  return (
    <div className="invoicepageContainer">
      <main className="h-full">
        <Container>
      <div className="flex flex-col items-center text-center mb-12">
        
              <Image src={companyInfo.logoUrl} alt="Company Logo"  width={90} height={52} className="h-12 mb-4" />
               <h1 className="text-3xl font-bold mb-4">Happiness Computers Ltd.</h1>
                <ul className="space-y-0">
                <li className="flex justify-center gap-4">
                  <strong className="font-medium text-sm">Address:</strong>
                  <span>{companyInfo.address}</span>
                </li>
                <li className="flex justify-center gap-4">
                  <strong className="font-medium text-sm">Phone:</strong>
                  <span>{companyInfo.phoneNumber}</span>
                </li>
                <li className="flex justify-center gap-4">
                  <strong className="font-medium text-sm">Email:</strong>
                  <span>{companyInfo.email}</span>
                </li>
              </ul>
            </div>

        <div className="flex justify-between mb-8">
         <h1 className="flex items-center gap-3 text-3xl font-bold text-left">
            Invoice: {invoiceId}
            <Badge className={cn(
              "rounded-full capitalize",
              result.status === 'open' && 'bg-blue-500',
              result.status === 'paid' && 'bg-green-600',
              result.status === 'void' && 'bg-zinc-700',
              result.status === 'uncollectible' && 'bg-red-600'
            )}>{result.status}</Badge>
          </h1>
          <div className="flex gap-4">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  Change Status
                  <ChevronDown className="w-4 h-auto"/>
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent>
              {AVAILABLE_STATUSES.map(status => {
                 return (
                <DropdownMenuItem key={status.id}>
                  <form action={updateStatusAction}>
                  <input type="hidden" name="id" value={invoiceId} />
                  <input type="hidden" name="status" value={status.id} />
                 <button>{status.label}</button>
                 </form>
                 </DropdownMenuItem>)})}
             </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  <span className="sr-only">More Options</span>
                  <Ellipsis className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent>
                <DropdownMenuItem>
                <DialogTrigger asChild>
                <button className="flex items-center gap-2">
                    <Trash2 className="w-4 h-auto" />
                    Delete Invoice
                    </button>
                </DialogTrigger>
                 </DropdownMenuItem>
                 </DropdownMenuContent>
            </DropdownMenu>
               <DialogContent className="flex justify-center">
                  <DialogHeader className="gap-2">
                    <DialogTitle className="text-gray-700 text-2xl">Delete Invoice?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete this Invoice
                        and remove the data from the database.
                    </DialogDescription>
                  </DialogHeader>
                    <DialogFooter>
                    <form  action={deleteInvoiceAction}>
                  <input type="hidden" name="id" value={invoiceId} />
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-auto" />
                    Delete Invoice
                    </Button>
                 </form>
                 </DialogFooter>
                </DialogContent>
              </Dialog>
           </div>
      </div>
 

        <p className="text-3xl mb-3">
          &#8358;{(result.amount / 100).toFixed(2)}
        </p>
        <p className="text-lg mb-8">
          {result.description}
        </p>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>
        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID:</strong>
            <span>{invoiceId}</span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date:</strong>
            <span>{new Date(result.createTs).toLocaleDateString()}</span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name:</strong>
            <span>{result.billingName}</span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Phone Number:</strong>
            <span>{result.phoneNumber}</span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Email:</strong>
            <span>{result.billingEmail}</span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Address:</strong>
            <span>{result.billingAddress}</span>
          </li>
       </ul>
       </Container>
      </main>
    </div>
  );
}
