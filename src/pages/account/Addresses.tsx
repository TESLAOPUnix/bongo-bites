import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Pencil, Trash2, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useAddresses, useCreateAddress, useDeleteAddress, useSetDefaultAddress } from '@/hooks/useAddresses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Addresses() {
  const { isAuthenticated } = useAuth();
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '',
  });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="section-container section-padding text-center py-16">
          <p className="text-muted-foreground mb-4">Please sign in to manage your addresses.</p>
          <Link to="/login"><Button>Sign In</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAddress.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || null,
        city: formData.city,
        state: formData.state,
        country: 'India',
        pincode: formData.pincode,
        is_default: (addresses || []).length === 0,
      });
      setFormData({ name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '' });
      setIsOpen(false);
      toast.success('Address added!');
    } catch {
      toast.error('Failed to add address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault.mutateAsync(id);
      toast.success('Default address updated!');
    } catch {
      toast.error('Failed to update default');
    }
  };

  const handleDelete = async (id: string) => {
    const addr = (addresses || []).find((a) => a.id === id);
    if (addr?.is_default && (addresses || []).length > 1) {
      toast.error('Please set another address as default first.');
      return;
    }
    try {
      await deleteAddress.mutateAsync(id);
      toast.success('Address deleted!');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <Layout>
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link><span>/</span>
            <Link to="/account" className="breadcrumb-link">My Account</Link><span>/</span>
            <span className="text-foreground">Addresses</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          <Link to="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />Back to Account
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold">My Addresses</h1>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" />Add Address</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Address</DialogTitle></DialogHeader>
                <form onSubmit={handleAddAddress} className="space-y-4 mt-4">
                  <div className="space-y-2"><Label>Address Label</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Home, Office" required /></div>
                  <div className="space-y-2"><Label>Phone Number</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 9876543210" required /></div>
                  <div className="space-y-2"><Label>Street Address</Label><Input value={formData.address_line1} onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })} placeholder="House/Flat No., Street" required /></div>
                  <div className="space-y-2"><Label>Address Line 2</Label><Input value={formData.address_line2} onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })} placeholder="Landmark (optional)" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>City</Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>State</Label><Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required /></div>
                  </div>
                  <div className="space-y-2"><Label>PIN Code</Label><Input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="700001" required /></div>
                  <Button type="submit" className="w-full" disabled={createAddress.isPending}>Save Address</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : (addresses || []).length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {(addresses || []).map((addr) => (
                <div key={addr.id} className={`p-4 rounded-xl border ${addr.is_default ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{addr.name}</span>
                      {addr.is_default && <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">Default</span>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(addr.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{addr.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  {!addr.is_default && (
                    <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => handleSetDefault(addr.id)}>
                      <Check className="h-3.5 w-3.5" />Set as Default
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">No addresses saved</h2>
              <p className="text-muted-foreground mb-6">Add an address for faster checkout.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
