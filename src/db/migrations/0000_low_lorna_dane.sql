CREATE TYPE "public"."status" AS ENUM('open', 'paid', 'void', 'uncollectible');--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"createTs" timestamp DEFAULT now() NOT NULL,
	"billingName" varchar(255) NOT NULL,
	"billingAddress" text NOT NULL,
	"billingEmail" varchar(255) NOT NULL,
	"phoneNumber" varchar(11) NOT NULL,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"userId" text NOT NULL,
	"status" "status" NOT NULL
);
