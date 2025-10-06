import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  price: string;
}

const products: Product[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Automation',
    description: 'Automate your WhatsApp business communications with our advanced bot technology.',
    icon: '📱',
    color: 'bg-green-500',
    features: ['Auto-reply messages', 'Broadcast campaigns', 'Customer segmentation', 'Analytics dashboard'],
    price: '₹4,999/month'
  },
  {
    id: 'wasender',
    title: 'Wasender',
    description: 'Send bulk WhatsApp messages to your customer base efficiently.',
    icon: '📨',
    color: 'bg-blue-500',
    features: ['Bulk messaging', 'Contact management', 'Message templates', 'Delivery reports'],
    price: '₹2,999/month'
  },
  {
    id: 'readygrow',
    title: 'Ready + Grow',
    description: 'Complete business growth package with all tools included.',
    icon: '🚀',
    color: 'bg-purple-500',
    features: ['All automation tools', 'Website development', 'Digital marketing', 'Priority support'],
    price: '₹14,999/month'
  },
  {
    id: 'mapextractor',
    title: 'Map Extractor',
    description: 'Extract business leads from Google Maps for targeted marketing.',
    icon: '🗺️',
    color: 'bg-orange-500',
    features: ['Location-based extraction', 'Business data mining', 'Contact information', 'Export options'],
    price: '₹3,999/month'
  },
  {
    id: 'digitalcard',
    title: 'Digital Visiting Card',
    description: 'Create professional digital business cards with modern features.',
    icon: '💳',
    color: 'bg-pink-500',
    features: ['Interactive design', 'Contact sharing', 'Analytics tracking', 'Multi-platform support'],
    price: '₹999/month'
  },
  {
    id: 'bulkivr',
    title: 'Bulk IVR Calls',
    description: 'Automated voice calling system for marketing and notifications.',
    icon: '📞',
    color: 'bg-red-500',
    features: ['Voice campaigns', 'Call scheduling', 'Response tracking', 'Custom messages'],
    price: '₹5,999/month'
  },
  {
    id: 'website',
    title: 'Website Service',
    description: 'Professional website development and maintenance services.',
    icon: '🌐',
    color: 'bg-teal-500',
    features: ['Responsive design', 'SEO optimization', 'Maintenance support', 'Custom development'],
    price: '₹19,999 one-time'
  }
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDemo = (productId: string) => {
    console.log(`Demo requested for product: ${productId}`);
  };

  const handlePurchase = (productId: string) => {
    console.log(`Purchase initiated for product: ${productId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
              <div className="space-y-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={cn(
                      "product-item",
                      selectedProduct?.id === product.id && "active"
                    )}
                    data-testid={`product-${product.id}`}
                  >
                    <span className={cn("w-8 h-8 rounded flex items-center justify-center mr-3", product.color)}>
                      {product.icon}
                    </span>
                    <div className="text-left">
                      <div className="font-medium">{product.title}</div>
                      <div className="text-sm text-muted-foreground">{product.description.substring(0, 40)}...</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {selectedProduct ? (
                <div>
                  <div className="text-center mb-6">
                    <span className="text-6xl mb-4 block">{selectedProduct.icon}</span>
                    <h3 className="text-2xl font-bold mb-2">{selectedProduct.title}</h3>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <span className="w-5 h-5 text-[hsl(var(--success))] mr-3">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Starting from</div>
                        <div className="text-xl font-bold" data-testid="product-price">{selectedProduct.price}</div>
                      </div>
                      <div className="space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => handleDemo(selectedProduct.id)}
                          data-testid="button-demo"
                        >
                          View Demo
                        </Button>
                        <Button
                          onClick={() => handlePurchase(selectedProduct.id)}
                          data-testid="button-buy"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📱</span>
                  <h3 className="text-xl font-semibold mb-2">Select a Product</h3>
                  <p className="text-muted-foreground">Choose a product from the left panel to view details, demo, and purchase options.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
