import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with comprehensive fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull().default(""),
  mobile: text("mobile"),
  city: text("city"),
  country: text("country"),
  businessCategory: text("business_category"),
  role: text("role").notNull().default("user"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  referralCode: varchar("referral_code", { length: 20 }).notNull().unique(),
  referredBy: varchar("referred_by", { length: 20 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  method: text("method").notNull(),
  status: text("status").notNull().default("pending"),
  provider: text("provider"),
  providerId: text("provider_id"),
  productId: text("product_id"),
  productName: text("product_name"),
  proofUrl: text("proof_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

// Withdrawals table
export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(),
  upiId: text("upi_id"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  ifscCode: text("ifsc_code"),
  accountHolderName: text("account_holder_name"),
  status: text("status").notNull().default("requested"),
  referenceId: text("reference_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  processedAt: timestamp("processed_at"),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  emoji: text("emoji"),
  isRead: boolean("is_read").notNull().default(false),
  isBroadcast: boolean("is_broadcast").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// FAQs table
export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Analytics Events table
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventType: text("event_type").notNull(),
  eventData: text("event_data"),
  productId: text("product_id"),
  videoId: text("video_id"),
  watchTime: integer("watch_time"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Referral Commissions table
export const referralCommissions = pgTable("referral_commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  paymentId: varchar("payment_id").notNull().references(() => payments.id),
  level: integer("level").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  referralCode: true,
  walletBalance: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export const insertReferralCommissionSchema = createInsertSchema(referralCommissions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

export type ReferralCommission = typeof referralCommissions.$inferSelect;
export type InsertReferralCommission = z.infer<typeof insertReferralCommissionSchema>;
