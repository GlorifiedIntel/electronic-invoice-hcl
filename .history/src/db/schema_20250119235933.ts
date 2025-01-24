import { pgTable, pgEnum, serial, timestamp, integer, text, varchar } from 'drizzle-orm/pg-core';
import { AVAILABLE_STATUSES } from '@/data/invoices';
export type Status = typeof AVAILABLE_STATUSES[number]["id"];
const statuses = AVAILABLE_STATUSES.map(({ id }) => id) as Array<Status>;
export const statusEnum = pgEnum('status', statuses as [Status, ...Array<Status>]);

export const Invoices = pgTable('invoices', {
  id: serial('id').primaryKey(), 
  createTs: timestamp('createTs').defaultNow().notNull(), 
  billingName: varchar('billingName', { length: 255 }).notNull(), 
  billingAddress: text('billingAddress').notNull(), 
  billingEmail: varchar('billingEmail', { length: 255 }).notNull(), 
  phoneNumber: varchar('phoneNumber', { length: 11 }).notNull(), 
  amount: integer('amount').notNull(), 
  description: text('description').notNull(),
  userId: text('userId').notNull(),  
  status: statusEnum('status').notNull(),
});

