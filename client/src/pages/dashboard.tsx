import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;
  const user = authService.getCurrentUser();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const successStories = [
    {
      name: "Raj Sharma",
      business: "E-commerce Business",
      avatar: "RS",
      story: "WhatsApp automation increased my customer engagement by 300%. Sales went from ₹50k to ₹2L per month!"
    },
    {
      name: "Priya Kumari",
      business: "Digital Marketing",
      avatar: "PK",
      story: "The referral program helped me build a passive income of ₹75k monthly. Best decision ever!"
    }
  ];

  return (
    <div className="w-full min-w-0">
      {/* Greeting Strip */}
      <div className="bg-gradient-to-r from-primary to-accent p-3 sm:p-4 lg:p-6 rounded-lg mb-3 sm:mb-4 lg:mb-6 text-primary-foreground">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">Good Morning, {user?.fullName?.split(' ')[0] || 'User'}! 🌟</h1>
        <p className="opacity-90 text-xs sm:text-sm lg:text-base">Ready to accelerate your business growth today?</p>
      </div>

      {/* Business Snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 lg:gap-4 xl:gap-6 mb-3 sm:mb-4 lg:mb-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Active Campaigns</span>
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-lg sm:text-2xl font-bold" data-testid="stat-campaigns">12</div>
            <div className="text-xs sm:text-sm text-[hsl(var(--success))]">+20% this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Revenue</span>
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-lg sm:text-2xl font-bold" data-testid="stat-revenue">₹2,45,670</div>
            <div className="text-xs sm:text-sm text-[hsl(var(--success))]">+15% this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Referrals</span>
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-lg sm:text-2xl font-bold" data-testid="stat-referrals">34</div>
            <div className="text-xs sm:text-sm text-[hsl(var(--success))]">+8 this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Success Rate</span>
              <Target className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-lg sm:text-2xl font-bold" data-testid="stat-success-rate">94%</div>
            <div className="text-xs sm:text-sm text-[hsl(var(--success))]">+2% this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Highlight */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Rocket className="w-10 h-10 text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Growth Journey</h3>
              <p className="text-muted-foreground mb-4">
                You're in the top 10% of businesses using our automation tools. Keep up the momentum!
              </p>
              <Button data-testid="button-view-insights">View Insights</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories Carousel */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Success Stories</h3>
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {successStories.map((story, index) => (
                <div key={index} className="w-full flex-shrink-0 p-4 bg-secondary rounded-lg mr-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium mr-3">
                      {story.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{story.name}</div>
                      <div className="text-sm text-muted-foreground">{story.business}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{story.story}</p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              onClick={prevSlide}
              data-testid="button-prev-slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={nextSlide}
              data-testid="button-next-slide"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Teaser */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">🎉 Limited Time Offer</h3>
              <p className="text-muted-foreground mb-4">
                Get 50% off on WhatsApp Business Automation package. Only 48 hours left!
              </p>
              <Button className="bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground">
                Claim Offer
              </Button>
            </div>
            <div className="text-6xl">⏰</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
