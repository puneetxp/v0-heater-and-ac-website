'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setEmail('');
        toast.success(data.message || 'Successfully subscribed!');
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        toast.error(data.message || data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('[newsletter-form] Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading || isSuccess}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={isLoading || isSuccess}
        className="bg-primary hover:bg-primary/90 min-w-fit"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {isSuccess && <Check className="h-4 w-4 mr-2" />}
        {isLoading ? 'Subscribing...' : isSuccess ? 'Subscribed!' : 'Subscribe'}
      </Button>
    </form>
  );
}
