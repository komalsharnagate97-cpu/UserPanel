import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How does the referral program work?',
    answer: 'Our referral program offers a 3-level commission structure. When you refer someone (Level 1), you earn 20% commission. When they refer someone (Level 2), you earn 10%, and for Level 3 referrals, you earn 5% commission.'
  },
  {
    id: '2',
    question: 'How can I withdraw my earnings?',
    answer: 'You can withdraw your earnings through bank transfer, UPI, or digital wallets. Minimum withdrawal amount is ₹1,000 and processing takes 1-3 business days.'
  },
  {
    id: '3',
    question: 'What is WhatsApp Automation?',
    answer: 'WhatsApp Automation allows you to automatically send messages, respond to customer queries, and manage your business communications efficiently. It includes features like auto-reply, broadcast messages, and customer segmentation.'
  },
  {
    id: '4',
    question: 'How do I get started with Map Extractor?',
    answer: 'Map Extractor helps you find potential customers by extracting business data from maps. Simply select your target area, choose business categories, and our tool will provide you with contact details and business information.'
  },
  {
    id: '5',
    question: 'Is there customer support available?',
    answer: 'Yes! We provide 24/7 customer support via WhatsApp, email, and phone. Our support team is always ready to help you with any questions or technical issues.'
  }
];

export default function FAQ() {
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  const toggleFAQ = (id: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(id)) {
      newOpenFAQs.delete(id);
    } else {
      newOpenFAQs.add(id);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const handleContactSupport = () => {
    console.log('Contact support clicked');
    window.open('https://wa.me/1234567890?text=Hello, I have a question', '_blank');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4 mb-8">
        {faqs.map((faq) => {
          const isOpen = openFAQs.has(faq.id);
          return (
            <Card key={faq.id}>
              <CardContent className="p-0">
                <button
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-secondary transition-colors"
                  onClick={() => toggleFAQ(faq.id)}
                  data-testid={`faq-question-${faq.id}`}
                >
                  <h3 className="font-medium">{faq.question}</h3>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0" data-testid={`faq-answer-${faq.id}`}>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Please chat with our friendly team.
          </p>
          <Button onClick={handleContactSupport} data-testid="button-contact-support">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
