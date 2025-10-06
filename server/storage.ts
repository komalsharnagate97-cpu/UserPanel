import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Payment,
  InsertPayment,
  Withdrawal,
  InsertWithdrawal,
  Notification,
  InsertNotification,
  FAQ,
  InsertFAQ,
  AnalyticsEvent,
  InsertAnalyticsEvent,
  ReferralCommission,
  InsertReferralCommission,
} from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = neon(databaseUrl);
export const db = drizzle(client, { schema });

// Storage Interface
export interface IStorage {
  // User operations
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWallet(userId: string, amount: string): Promise<void>;
  updateUser(userId: string, data: Partial<User>): Promise<User | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentById(id: string): Promise<Payment | undefined>;
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
  updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined>;
  
  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getWithdrawalsByUserId(userId: string): Promise<Withdrawal[]>;
  updateWithdrawal(id: string, data: Partial<Withdrawal>): Promise<Withdrawal | undefined>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // FAQ operations
  getAllFaqs(): Promise<FAQ[]>;
  getFaqsByCategory(category: string): Promise<FAQ[]>;
  createFaq(faq: InsertFAQ): Promise<FAQ>;
  
  // Analytics operations
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsByUserId(userId: string): Promise<AnalyticsEvent[]>;
  
  // Referral operations
  createReferralCommission(commission: InsertReferralCommission): Promise<ReferralCommission>;
  getReferralsByUserId(userId: string): Promise<ReferralCommission[]>;
  getReferredUsers(userId: string): Promise<User[]>;
}

// PostgreSQL Storage Implementation
export class PgStorage implements IStorage {
  // User operations
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.referralCode, code)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Generate unique referral code
    const referralCode = `REF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    
    const result = await db.insert(schema.users).values({
      ...insertUser,
      referralCode,
    }).returning();
    return result[0];
  }

  async updateUserWallet(userId: string, amount: string): Promise<void> {
    await db.update(schema.users)
      .set({ 
        walletBalance: sql`${schema.users.walletBalance} + ${amount}` 
      })
      .where(eq(schema.users.id, userId));
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(schema.users)
      .set(data)
      .where(eq(schema.users.id, userId))
      .returning();
    return result[0];
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(schema.payments).values(payment).returning();
    return result[0];
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(schema.payments).where(eq(schema.payments.id, id)).limit(1);
    return result[0];
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return db.select().from(schema.payments)
      .where(eq(schema.payments.userId, userId))
      .orderBy(desc(schema.payments.createdAt));
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined> {
    const result = await db.update(schema.payments)
      .set(data)
      .where(eq(schema.payments.id, id))
      .returning();
    return result[0];
  }

  // Withdrawal operations
  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const result = await db.insert(schema.withdrawals).values(withdrawal).returning();
    return result[0];
  }

  async getWithdrawalsByUserId(userId: string): Promise<Withdrawal[]> {
    return db.select().from(schema.withdrawals)
      .where(eq(schema.withdrawals.userId, userId))
      .orderBy(desc(schema.withdrawals.createdAt));
  }

  async updateWithdrawal(id: string, data: Partial<Withdrawal>): Promise<Withdrawal | undefined> {
    const result = await db.update(schema.withdrawals)
      .set(data)
      .where(eq(schema.withdrawals.id, id))
      .returning();
    return result[0];
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(schema.notifications).values(notification).returning();
    return result[0];
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return db.select().from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.userId, userId),
          eq(schema.notifications.isBroadcast, false)
        )
      )
      .orderBy(desc(schema.notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(schema.notifications)
      .set({ isRead: true })
      .where(eq(schema.notifications.id, id));
  }

  // FAQ operations
  async getAllFaqs(): Promise<FAQ[]> {
    return db.select().from(schema.faqs).orderBy(schema.faqs.category, schema.faqs.order);
  }

  async getFaqsByCategory(category: string): Promise<FAQ[]> {
    return db.select().from(schema.faqs)
      .where(eq(schema.faqs.category, category))
      .orderBy(schema.faqs.order);
  }

  async createFaq(faq: InsertFAQ): Promise<FAQ> {
    const result = await db.insert(schema.faqs).values(faq).returning();
    return result[0];
  }

  // Analytics operations
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const result = await db.insert(schema.analyticsEvents).values(event).returning();
    return result[0];
  }

  async getAnalyticsByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return db.select().from(schema.analyticsEvents)
      .where(eq(schema.analyticsEvents.userId, userId))
      .orderBy(desc(schema.analyticsEvents.createdAt));
  }

  // Referral operations
  async createReferralCommission(commission: InsertReferralCommission): Promise<ReferralCommission> {
    const result = await db.insert(schema.referralCommissions).values(commission).returning();
    return result[0];
  }

  async getReferralsByUserId(userId: string): Promise<ReferralCommission[]> {
    return db.select().from(schema.referralCommissions)
      .where(eq(schema.referralCommissions.toUserId, userId))
      .orderBy(desc(schema.referralCommissions.createdAt));
  }

  async getReferredUsers(userId: string): Promise<User[]> {
    const user = await this.getUserById(userId);
    if (!user) return [];
    
    return db.select().from(schema.users)
      .where(eq(schema.users.referredBy, user.referralCode));
  }
}

export const storage = new PgStorage();
