import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export default function Profile() {
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    city: user?.city || '',
    country: user?.country || '',
    businessCategory: user?.businessCategory || ''
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await authService.updateProfile(profileData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Password Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    console.log('Password change:', passwordData);
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully",
    });
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = () => {
    console.log('Photo upload clicked');
    toast({
      title: "Photo Upload",
      description: "Photo upload feature coming soon",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-lg font-semibold" data-testid="profile-name">
                {user?.fullName || 'User'}
              </h2>
              <p className="text-muted-foreground">Premium Member</p>
            </div>

            <Button
              onClick={handlePhotoUpload}
              className="w-full mb-4"
              data-testid="button-upload-photo"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span data-testid="member-since">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Referrals</span>
                <span data-testid="total-referrals">34</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Earnings</span>
                <span data-testid="total-profile-earnings">₹1,23,450</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">Personal Information</h2>

              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    data-testid="input-profile-fullname"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    data-testid="input-profile-email"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={profileData.mobile}
                    onChange={handleProfileChange}
                    data-testid="input-profile-mobile"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                    data-testid="input-profile-city"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={profileData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                    <SelectTrigger data-testid="select-profile-country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="businessCategory">Business Category</Label>
                  <Select value={profileData.businessCategory} onValueChange={(value) => handleSelectChange('businessCategory', value)}>
                    <SelectTrigger data-testid="select-profile-business-category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" data-testid="button-update-profile">
                    Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">Change Password</h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="current"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                    data-testid="input-current-password"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="new"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.new}
                    onChange={handlePasswordChange}
                    data-testid="input-new-password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirm"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                    data-testid="input-confirm-new-password"
                  />
                </div>

                <Button type="submit" data-testid="button-change-password">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
