import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { X, Gift, BarChart3, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  read: boolean;
}

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome Bonus Activated!',
      message: 'Congratulations! Your welcome bonus of ₹5,000 has been credited to your account.',
      time: '2 hours ago',
      icon: Gift,
      iconColor: 'bg-primary',
      read: false
    },
    {
      id: '2',
      title: 'Monthly Report Ready',
      message: 'Your monthly performance report is now available for download.',
      time: '1 day ago',
      icon: BarChart3,
      iconColor: 'bg-accent',
      read: false
    },
    {
      id: '3',
      title: 'New Referral Joined',
      message: 'Priya Kumar joined using your referral code. You earned ₹2,500 commission!',
      time: '3 days ago',
      icon: Users,
      iconColor: 'bg-muted',
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    email: true,
    push: false,
    marketing: true
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    console.log(`${key} notifications ${!settings[key] ? 'enabled' : 'disabled'}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button onClick={markAllRead} data-testid="button-mark-all-read">
          Mark All Read
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Card
              key={notification.id}
              className={`hover:bg-secondary transition-colors ${notification.read ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 ${notification.iconColor} rounded-full flex items-center justify-center text-primary-foreground`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium" data-testid={`notification-title-${notification.id}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground" data-testid={`notification-message-${notification.id}`}>
                      {notification.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => dismissNotification(notification.id)}
                    data-testid={`button-dismiss-${notification.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email}
                onCheckedChange={() => toggleSetting('email')}
                data-testid="switch-email"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.push}
                onCheckedChange={() => toggleSetting('push')}
                data-testid="switch-push"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-notifications">Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
              </div>
              <Switch
                id="marketing-notifications"
                checked={settings.marketing}
                onCheckedChange={() => toggleSetting('marketing')}
                data-testid="switch-marketing"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
