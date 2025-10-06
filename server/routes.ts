import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import Razorpay from "razorpay";
import Stripe from "stripe";
import multer from "multer";
import crypto from "crypto";
import { storage } from "./storage";
import { supabase } from "./supabase";
import { insertUserSchema, insertPaymentSchema, insertWithdrawalSchema, insertAnalyticsEventSchema } from "@shared/schema";

// Payment provider initialization - only initialize if credentials are provided
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null;

// File upload configuration
const upload = multer({ dest: "uploads/" });

// Middleware to verify Supabase JWT token
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

async function authenticateToken(req: AuthRequest, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Get user from database to include role and other info
    const dbUser = await storage.getUserById(data.user.id);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found in database" });
    }

    req.user = {
      userId: data.user.id,
      email: data.user.email || "",
      role: dbUser.role,
    };
    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// Referral commission percentages for 3 levels
const COMMISSION_RATES = {
  level1: 0.10, // 10%
  level2: 0.05, // 5%
  level3: 0.03, // 3%
};

// Helper function to process referral commissions
async function processReferralCommissions(paymentId: string, userId: string, amount: number) {
  try {
    const user = await storage.getUserById(userId);
    if (!user || !user.referredBy) return;

    // Level 1: Direct referrer
    const level1User = await storage.getUserByReferralCode(user.referredBy);
    if (level1User) {
      const level1Amount = (amount * COMMISSION_RATES.level1).toFixed(2);
      await storage.createReferralCommission({
        fromUserId: userId,
        toUserId: level1User.id,
        paymentId,
        level: 1,
        amount: level1Amount,
      });
      await storage.updateUserWallet(level1User.id, level1Amount);

      // Level 2: Referrer's referrer
      if (level1User.referredBy) {
        const level2User = await storage.getUserByReferralCode(level1User.referredBy);
        if (level2User) {
          const level2Amount = (amount * COMMISSION_RATES.level2).toFixed(2);
          await storage.createReferralCommission({
            fromUserId: userId,
            toUserId: level2User.id,
            paymentId,
            level: 2,
            amount: level2Amount,
          });
          await storage.updateUserWallet(level2User.id, level2Amount);

          // Level 3: Referrer's referrer's referrer
          if (level2User.referredBy) {
            const level3User = await storage.getUserByReferralCode(level2User.referredBy);
            if (level3User) {
              const level3Amount = (amount * COMMISSION_RATES.level3).toFixed(2);
              await storage.createReferralCommission({
                fromUserId: userId,
                toUserId: level3User.id,
                paymentId,
                level: 3,
                amount: level3Amount,
              });
              await storage.updateUserWallet(level3User.id, level3Amount);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing referral commissions:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Initialize Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("authenticate", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Store io instance for use in routes
  app.set("io", io);

  // ===== Authentication Routes =====

  // Signup
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, fullName, mobile, city, country, businessCategory, referredBy } = req.body;

      // Validate referral code if provided
      if (referredBy) {
        const referrer = await storage.getUserByReferralCode(referredBy);
        if (!referrer) {
          return res.status(400).json({ message: "Invalid referral code" });
        }
      }

      // Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Supabase signup error:", authError);
        return res.status(400).json({ message: authError.message || "Signup failed" });
      }

      if (!authData.user) {
        return res.status(400).json({ message: "Failed to create user" });
      }

      // Create user in our database with Supabase user ID
      const user = await storage.createUser({
        id: authData.user.id,
        fullName,
        email,
        password: "",
        mobile,
        city,
        country,
        businessCategory,
        referredBy,
        role: "user",
      });

      // Track signup analytics
      await storage.createAnalyticsEvent({
        userId: user.id,
        eventType: "signup",
        eventData: JSON.stringify({ email: user.email }),
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        user: userWithoutPassword,
        session: authData.session,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        return res.status(401).json({ message: error.message || "Invalid email or password" });
      }

      if (!data.user) {
        return res.status(401).json({ message: "Login failed" });
      }

      // Get user from database
      const user = await storage.getUserById(data.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found in database" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        session: data.session,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // ===== Payment Routes =====

  // Create Razorpay order
  app.post("/api/payments/razorpay/create-order", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!razorpay) {
        return res.status(503).json({ message: "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables." });
      }

      const { amount, currency, productId, productName } = req.body;

      const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency: currency || "INR",
        receipt: `rcpt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      // Create payment record
      await storage.createPayment({
        userId: req.user!.userId,
        amount: amount.toString(),
        currency: currency || "INR",
        method: "razorpay",
        status: "pending",
        provider: "razorpay",
        providerId: order.id,
        productId,
        productName,
      });

      res.json(order);
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Create Stripe payment intent
  app.post("/api/payments/stripe/create-intent", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." });
      }

      const { amount, currency, productId, productName } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // amount in cents
        currency: currency || "usd",
        metadata: {
          userId: req.user!.userId,
          productId,
          productName,
        },
      });

      // Create payment record
      await storage.createPayment({
        userId: req.user!.userId,
        amount: amount.toString(),
        currency: currency || "USD",
        method: "stripe",
        status: "pending",
        provider: "stripe",
        providerId: paymentIntent.id,
        productId,
        productName,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Manual payment submission (I've Paid flow)
  app.post("/api/payments/manual", authenticateToken, upload.single("proof"), async (req: AuthRequest, res: Response) => {
    try {
      const { amount, method, productId, productName, notes } = req.body;
      const proofUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      const payment = await storage.createPayment({
        userId: req.user!.userId,
        amount: amount.toString(),
        currency: "INR",
        method,
        status: "pending",
        productId,
        productName,
        proofUrl,
        notes,
      });

      res.status(201).json(payment);
    } catch (error: any) {
      console.error("Manual payment error:", error);
      res.status(500).json({ message: "Failed to submit payment" });
    }
  });

  // Razorpay webhook
  app.post("/api/webhooks/razorpay", async (req: Request, res: Response) => {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (signature !== expectedSignature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const event = req.body.event;
      const payload = req.body.payload;

      if (event === "payment.captured") {
        const orderId = payload.payment.entity.order_id;
        const payments = await storage.getPaymentsByUserId("");
        const payment = payments.find((p) => p.providerId === orderId);

        if (payment) {
          // Update payment status
          await storage.updatePayment(payment.id, {
            status: "completed",
            completedAt: new Date(),
          });

          // Credit user wallet
          await storage.updateUserWallet(payment.userId, payment.amount);

          // Process referral commissions
          await processReferralCommissions(payment.id, payment.userId, parseFloat(payment.amount));

          // Track analytics
          await storage.createAnalyticsEvent({
            userId: payment.userId,
            eventType: "payment_completed",
            eventData: JSON.stringify({ paymentId: payment.id, amount: payment.amount }),
          });
        }
      }

      res.json({ status: "ok" });
    } catch (error: any) {
      console.error("Razorpay webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Stripe webhook
  app.post("/api/webhooks/stripe", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe is not configured" });
      }

      const signature = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
      } catch (err: any) {
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const payments = await storage.getPaymentsByUserId("");
        const payment = payments.find((p) => p.providerId === paymentIntent.id);

        if (payment) {
          // Update payment status
          await storage.updatePayment(payment.id, {
            status: "completed",
            completedAt: new Date(),
          });

          // Credit user wallet
          await storage.updateUserWallet(payment.userId, payment.amount);

          // Process referral commissions
          await processReferralCommissions(payment.id, payment.userId, parseFloat(payment.amount));

          // Track analytics
          await storage.createAnalyticsEvent({
            userId: payment.userId,
            eventType: "payment_completed",
            eventData: JSON.stringify({ paymentId: payment.id, amount: payment.amount }),
          });
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Get user payments
  app.get("/api/payments", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const payments = await storage.getPaymentsByUserId(req.user!.userId);
      res.json(payments);
    } catch (error: any) {
      console.error("Get payments error:", error);
      res.status(500).json({ message: "Failed to get payments" });
    }
  });

  // ===== Wallet Routes =====

  // Get wallet balance
  app.get("/api/wallet/balance", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ balance: user.walletBalance });
    } catch (error: any) {
      console.error("Get wallet balance error:", error);
      res.status(500).json({ message: "Failed to get wallet balance" });
    }
  });

  // ===== Withdrawal Routes =====

  // Create withdrawal request
  app.post("/api/withdrawals", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertWithdrawalSchema.parse({
        ...req.body,
        userId: req.user!.userId,
      });

      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has sufficient balance
      if (parseFloat(user.walletBalance) < parseFloat(validatedData.amount)) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const withdrawal = await storage.createWithdrawal(validatedData);
      res.status(201).json(withdrawal);
    } catch (error: any) {
      console.error("Create withdrawal error:", error);
      res.status(500).json({ message: "Failed to create withdrawal request" });
    }
  });

  // Get user withdrawals
  app.get("/api/withdrawals", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const withdrawals = await storage.getWithdrawalsByUserId(req.user!.userId);
      res.json(withdrawals);
    } catch (error: any) {
      console.error("Get withdrawals error:", error);
      res.status(500).json({ message: "Failed to get withdrawals" });
    }
  });

  // ===== Notification Routes =====

  // Get user notifications
  app.get("/api/notifications", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const notifications = await storage.getNotificationsByUserId(req.user!.userId);
      res.json(notifications);
    } catch (error: any) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Failed to get notifications" });
    }
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error: any) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // ===== FAQ Routes =====

  // Get all FAQs
  app.get("/api/faqs", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      const faqs = category
        ? await storage.getFaqsByCategory(category as string)
        : await storage.getAllFaqs();
      
      res.json(faqs);
    } catch (error: any) {
      console.error("Get FAQs error:", error);
      res.status(500).json({ message: "Failed to get FAQs" });
    }
  });

  // ===== Analytics Routes =====

  // Track analytics event
  app.post("/api/analytics/track", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertAnalyticsEventSchema.parse({
        ...req.body,
        userId: req.user!.userId,
      });

      const event = await storage.createAnalyticsEvent(validatedData);
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Track analytics error:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });

  // Export user data as CSV
  app.get("/api/analytics/export", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const payments = await storage.getPaymentsByUserId(req.user!.userId);
      const referrals = await storage.getReferralsByUserId(req.user!.userId);

      // Create CSV
      let csv = "Type,Date,Amount,Status,Details\n";
      
      payments.forEach((payment) => {
        csv += `Payment,${payment.createdAt},"${payment.amount}",${payment.status},"${payment.productName || ''}"\n`;
      });

      referrals.forEach((referral) => {
        csv += `Referral,${referral.createdAt},"${referral.amount}",Level ${referral.level},Commission\n`;
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=user-data.csv");
      res.send(csv);
    } catch (error: any) {
      console.error("Export CSV error:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // ===== Referral Routes =====

  // Get user referrals
  app.get("/api/referrals", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const referrals = await storage.getReferralsByUserId(req.user!.userId);
      res.json(referrals);
    } catch (error: any) {
      console.error("Get referrals error:", error);
      res.status(500).json({ message: "Failed to get referrals" });
    }
  });

  // Get referred users
  app.get("/api/referrals/users", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const users = await storage.getReferredUsers(req.user!.userId);
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      console.error("Get referred users error:", error);
      res.status(500).json({ message: "Failed to get referred users" });
    }
  });

  // ===== Profile Routes =====

  // Update profile
  app.patch("/api/profile", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { fullName, mobile, city, country, businessCategory } = req.body;

      const updatedUser = await storage.updateUser(req.user!.userId, {
        fullName,
        mobile,
        city,
        country,
        businessCategory,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  return httpServer;
}
