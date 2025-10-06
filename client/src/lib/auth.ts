import { supabase } from "./supabase";

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  country: string;
  businessCategory: string;
  role: string;
  walletBalance: string;
  referralCode: string;
  referredBy?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  city: string;
  country: string;
  businessCategory: string;
  referredBy?: string;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Load current user on initialization
    this.loadCurrentUser();
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        this.currentUser = null;
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.loadCurrentUser();
      }
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch current user from backend
        const response = await fetch("/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          this.currentUser = await response.json();
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
      this.logout();
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    
    // Set Supabase session
    if (data.session) {
      await supabase.auth.setSession(data.session);
    }
    
    this.currentUser = data.user;
    return data.user;
  }

  async signup(signupData: SignupData): Promise<User> {
    if (signupData.password !== signupData.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const { confirmPassword, ...data } = signupData;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const responseData = await response.json();
    
    // Set Supabase session
    if (responseData.session) {
      await supabase.auth.setSession(responseData.session);
    }
    
    this.currentUser = responseData.user;
    return responseData.user;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No authentication session");
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Update profile failed");
    }

    const updatedUser = await response.json();
    this.currentUser = updatedUser;
    return updatedUser;
  }

  async logout(): Promise<void> {
    console.log("Logging out user...");
    this.currentUser = null;
    await supabase.auth.signOut();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }
}

export const authService = new AuthService();
