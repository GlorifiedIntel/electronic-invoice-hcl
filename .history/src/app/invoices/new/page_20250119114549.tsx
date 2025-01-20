"use client";

import { SyntheticEvent, useState } from "react";
import Form from "next/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import { createAction } from "@/app/actions";
import Container from "@/components/Container";

export default function NewInvoicePage() {
  type InvoiceStatus = "open" | "paid" | "void" | "uncollectible";

  const [state, setState] = useState("ready");
  const [status, setStatus] = useState<InvoiceStatus>("open");

  const companyInfo = {
    name: "Happiness Computers Limited",
    logoUrl: "/hclogo.png", 
    address: "Suite 15 & 22, Zone 3 Shooping Complex, Wuse, Abuja",
    phoneNumber: "08036046736; 08032949083",
    email: "happinesscomputer2020@gmail.com",
  };

  async function handleOnSubmit(event: SyntheticEvent) {
    if (state === "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  }

  const statusBgColors: Record<InvoiceStatus, string> = {
    open: "bg-blue-500",
    paid: "bg-green-600",
    void: "bg-zinc-700",
    uncollectible: "bg-red-600",
  };

  return (
    <div className={`newinvoiceContainer ${statusBgColors[status]}`}>
      <main className="h-full">
        <Container>
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-left mb-6">Create Invoice</h1>
          </div>

          {/* Company Info Section */}
          <div className="mb-6 text-center">
            <img src={companyInfo.logoUrl} alt={companyInfo.name} className="mx-auto mb-2" />
            <h2 className="text-2xl font-semibold">{companyInfo.name}</h2>
            <p>{companyInfo.address}</p>
            <p>{companyInfo.phoneNumber}</p>
            <p>{companyInfo.email}</p>
          </div>

          <Form action={createAction} onSubmit={handleOnSubmit} className="grid gap-4 w-6/12">
            <div>
              <Label htmlFor="billingName" className="block font-semibold text-sm mb-2">
                Billing Name
              </Label>
              <Input id="billingName" name="billingName" type="text" placeholder="Enter Customer's name" required />
            </div>

            <div>
              <Label htmlFor="billingAddress" className="block font-semibold text-sm mb-2">
                Billing Address
              </Label>
              <Textarea
                id="billingAddress"
                name="billingAddress"
                placeholder="Enter Customer's address"
                required
              ></Textarea>
            </div>

            <div>
              <Label htmlFor="billingEmail" className="block font-semibold text-sm mb-2">
                Billing Email
              </Label>
              <Input id="billingEmail" name="billingEmail" type="email" placeholder="Enter Customer's email" />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="block font-semibold text-sm mb-2">
                Phone Number
              </Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="Enter Customer's phone number" required />
            </div>

            <div>
              <Label htmlFor="amount" className="block font-semibold text-sm mb-2">
                Amount
              </Label>
              <Input id="amount" name="amount" type="number" placeholder="Enter the amount" required />
            </div>

            <div>
              <Label htmlFor="description" className="block font-semibold text-sm mb-2">
                Description
              </Label>
              <Textarea id="description" name="description" placeholder="Enter a description" required></Textarea>
            </div>

            <div>
              <Label htmlFor="status" className="block font-semibold text-sm mb-2">
                Status
              </Label>
              <select
                id="status"
                name="status"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}>
                <option value="open">Open</option>
                <option value="paid">Paid</option>
                <option value="void">Void</option>
                <option value="uncollectible">Uncollectible</option>
              </select>
            </div>

            <div>
              <SubmitButton />
            </div>
          </Form>
        </Container>
      </main>
    </div>
  );
}
