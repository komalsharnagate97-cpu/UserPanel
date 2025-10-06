import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authService, SignupData } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    city: '',
    country: '',
    businessCategory: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.signup(formData);
      toast({
        title: "Account Created",
        description: "Welcome! Redirecting to dashboard...",
      });
      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Please check your information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join our business growth platform</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                data-testid="input-fullname"
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
                data-testid="input-mobile"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                required
                data-testid="input-city"
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Select onValueChange={(value) => handleSelectChange('country', value)} required>
                <SelectTrigger data-testid="select-country">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="afghanistan">Afghanistan</SelectItem>
                  <SelectItem value="algeria">Algeria</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="bhutan">Bhutan</SelectItem>
                  <SelectItem value="brazil">Brazil</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                  <SelectItem value="denmark">Denmark</SelectItem>
                  <SelectItem value="egypt">Egypt</SelectItem>
                  <SelectItem value="ethiopia">Ethiopia</SelectItem>
                  <SelectItem value="finland">Finland</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="ghana">Ghana</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="iran">Iran</SelectItem>
                  <SelectItem value="iraq">Iraq</SelectItem>
                  <SelectItem value="italy">Italy</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="libya">Libya</SelectItem>
                  <SelectItem value="malaysia">Malaysia</SelectItem>
                  <SelectItem value="maldives">Maldives</SelectItem>
                  <SelectItem value="mexico">Mexico</SelectItem>
                  <SelectItem value="morocco">Morocco</SelectItem>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="netherlands">Netherlands</SelectItem>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="norway">Norway</SelectItem>
                  <SelectItem value="pakistan">Pakistan</SelectItem>
                  <SelectItem value="philippines">Philippines</SelectItem>
                  <SelectItem value="russia">Russia</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="south_africa">South Africa</SelectItem>
                  <SelectItem value="south_korea">South Korea</SelectItem>
                  <SelectItem value="spain">Spain</SelectItem>
                  <SelectItem value="sri_lanka">Sri Lanka</SelectItem>
                  <SelectItem value="sudan">Sudan</SelectItem>
                  <SelectItem value="sweden">Sweden</SelectItem>
                  <SelectItem value="thailand">Thailand</SelectItem>
                  <SelectItem value="tunisia">Tunisia</SelectItem>
                  <SelectItem value="turkey">Turkey</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="vietnam">Vietnam</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessCategory">Business Category</Label>
              <Select onValueChange={(value) => handleSelectChange('businessCategory', value)} required>
                <SelectTrigger data-testid="select-business-category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accounting">Accounting</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="aerospace">Aerospace</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="biotechnology">Biotechnology</SelectItem>
                  <SelectItem value="charity">Charity</SelectItem>
                  <SelectItem value="chemicals">Chemicals</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="event_planning">Event Planning</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="marine">Marine</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="mining">Mining</SelectItem>
                  <SelectItem value="non_profit">Non-Profit</SelectItem>
                  <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="telecommunications">Telecommunications</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="referredBy">Referral Code (Optional)</Label>
              <Input
                id="referredBy"
                name="referredBy"
                placeholder="Enter referral code if you have one"
                value={formData.referredBy || ''}
                onChange={handleChange}
                data-testid="input-referral-code"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                data-testid="input-password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                data-testid="input-confirm-password"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-signup"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>

            <div className="md:col-span-2 text-center">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-accent p-0"
                onClick={() => setLocation('/login')}
                data-testid="link-login"
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
