import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [initialized, setInitialized] = useState(false);

  // Initialize form with profile data
  if (profile && !initialized) {
    setFormData({
      name: profile.full_name || user?.name || '',
      email: profile.email || user?.email || '',
      phone: profile.phone || '',
    });
    setInitialized(true);
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="section-container section-padding text-center py-16">
          <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
          <Link to="/login"><Button>Sign In</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        full_name: formData.name,
        phone: formData.phone,
      });
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Layout>
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            <Link to="/account" className="breadcrumb-link">My Account</Link>
            <span>/</span>
            <span className="text-foreground">Profile</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="max-w-xl mx-auto">
          <Link to="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />Back to Account
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Profile Information</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={formData.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 9876543210" />
            </div>
            <Button type="submit" disabled={updateProfile.isPending} className="w-full">
              {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
