import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Referral() {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const handleShare = () => {
    console.log('Share referral link');
    toast({
      title: "Share Link",
      description: "Referral link shared successfully",
    });
  };

  const handleWithdraw = () => {
    console.log('Withdraw earnings request');
    toast({
      title: "Withdraw Request",
      description: "Your withdrawal request has been submitted",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Referral Program</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Referral Chain */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Referral Network</h2>

            <div className="space-y-4">
              {/* Level 1 */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Level 1 (Direct)</span>
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm" data-testid="level-1-count">
                    8 People
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Commission: 20%</div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">A</div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">B</div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">C</div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">+5</div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="border border-border rounded-lg p-4 ml-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Level 2 (Indirect)</span>
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm" data-testid="level-2-count">
                    15 People
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Commission: 10%</div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">D</div>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">E</div>
                  <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">+13</div>
                </div>
              </div>

              {/* Level 3 */}
              <div className="border border-border rounded-lg p-4 ml-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Level 3 (Extended)</span>
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm" data-testid="level-3-count">
                    7 People
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Commission: 5%</div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-teal-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">F</div>
                  <div className="w-8 h-8 bg-indigo-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">G</div>
                  <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-background flex items-center justify-center text-white text-xs">+5</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet/Earnings */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Earnings Wallet</h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-lg text-primary-foreground">
                <div className="text-sm opacity-90">Total Earnings</div>
                <div className="text-2xl font-bold" data-testid="total-earnings">₹1,23,450</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">This Month</div>
                    <div className="text-lg font-semibold" data-testid="monthly-earnings">₹28,750</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Available</div>
                    <div className="text-lg font-semibold" data-testid="available-earnings">₹45,200</div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleWithdraw}
                className="w-full bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground"
                data-testid="button-withdraw"
              >
                Withdraw Earnings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Invite & Share</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="referralCode">Your Referral Code</Label>
              <div className="flex">
                <Input
                  id="referralCode"
                  value="REF123ABC"
                  readOnly
                  data-testid="referral-code"
                />
                <Button
                  onClick={() => handleCopy('REF123ABC')}
                  className="ml-2"
                  data-testid="button-copy-code"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="referralLink">Referral Link</Label>
              <div className="flex">
                <Input
                  id="referralLink"
                  value="https://userpanel.com/ref/REF123ABC"
                  readOnly
                  className="text-sm"
                  data-testid="referral-link"
                />
                <Button
                  onClick={handleShare}
                  className="ml-2"
                  data-testid="button-share-link"
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
