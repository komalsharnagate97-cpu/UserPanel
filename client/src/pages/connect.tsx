import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone, Clock } from 'lucide-react';

export default function Connect() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/919730544879?text=Hello, I need support', '_blank');
  };

  const handleEmail = () => {
    const email = 'edigitalservices1997@gmail.com';
    const subject = 'Support Request';
    const body = 'Hello, I need help with...';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Create a temporary anchor element to trigger the mailto
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.target = '_self';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-w-0">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6">Connect With Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-4 lg:mb-6">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">WhatsApp Support</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Get instant support via WhatsApp. Our team is available 24/7 to help you.
            </p>
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-whatsapp"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat on WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Email Support</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <Button
              onClick={handleEmail}
              data-testid="button-email"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-medium text-sm sm:text-base">Phone</h3>
                <p className="text-xs sm:text-sm text-muted-foreground break-all" data-testid="contact-phone">+91 9730544879</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-medium text-sm sm:text-base">Email</h3>
                <p className="text-xs sm:text-sm text-muted-foreground break-all" data-testid="contact-email">edigitalservices1997@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-medium text-sm sm:text-base">Hours</h3>
                <p className="text-xs sm:text-sm text-muted-foreground" data-testid="contact-hours">24/7 Support Available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
