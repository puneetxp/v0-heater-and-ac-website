"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@/lib/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus, Trash2, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function AddressesPage() {
  const supabase = useSupabaseClient();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    label: "Home",
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Pincode Lookup Logic
  const [pincodeResults, setPincodeResults] = useState<any[]>([]);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  useEffect(() => {
    async function init() {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          fetchAddresses(user.id);
        }
      }
    }
    init();
  }, [supabase]);

  async function fetchAddresses(userId: string) {
    if (!supabase) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setAddresses(data || []);
    setIsLoading(false);
  }

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData({ ...formData, pincode: code });

    if (code.length === 6) {
      setIsPincodeLoading(true);
      try {
        const response = await fetch(`https://pincode.deno.dev/${code}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPincodeResults(data);
          setFormData(prev => ({
            ...prev,
            city: data[0].district,
            state: data[0].state,
          }));
        }
      } catch (err) {
        console.error("Pincode lookup failed:", err);
      } finally {
        setIsPincodeLoading(false);
      }
    } else {
      setPincodeResults([]);
    }
  };

  const handleSelectLocation = (loc: any) => {
    setFormData(prev => ({
      ...prev,
      address: `${loc.vpo}, ${prev.address}`.replace(/undefined, /, "").trim(),
      city: loc.district,
      state: loc.state,
    }));
    setPincodeResults([]);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("user_addresses").insert({
        user_id: user.id,
        ...formData
      });

      if (error) throw error;

      setShowAddForm(false);
      setFormData({
        label: "Home",
        full_name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      fetchAddresses(user.id);
    } catch (err) {
      console.error("Failed to add address:", err);
      alert("Failed to add address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?") || !supabase) return;

    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", id);
      if (error) throw error;
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to delete address:", err);
      alert("Failed to delete address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!supabase || !user) return;
    try {
      // First, remove default from all
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id);
      // Then, set this one as default
      const { error } = await supabase.from("user_addresses").update({ is_default: true }).eq("id", id);
      if (error) throw error;
      fetchAddresses(user.id);
    } catch (err) {
      console.error("Failed to set default:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Addresses</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your delivery locations for faster checkout</p>
        </div>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-bold"
          >
            <Plus className="h-5 w-5" />
            Add New Address
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="border-none shadow-xl bg-white overflow-hidden animate-in slide-in-from-top-4 duration-300 py-0">
          <CardHeader className="bg-slate-100 py-6">
            <CardTitle className="text-xl">Add New Address</CardTitle>
            <CardDescription className="text-slate-400">Enter your delivery details below</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleAddAddress} className="space-y-6">
              {/* Pincode Section - Moved to top for better UX */}
              <div className="space-y-2 relative">
                <Label htmlFor="pincode">Pincode (Auto-fills City & State)</Label>
                <div className="relative">
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    placeholder="e.g. 122003"
                    maxLength={6}
                    required
                    className="text-lg tracking-widest font-mono h-12"
                  />
                  {isPincodeLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                {pincodeResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Select Location
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {pincodeResults.map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                        >
                          <span className="font-bold">{loc.vpo}</span>
                          <span className="text-slate-500 ml-2">({loc.district})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {formData.pincode.length === 6 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="label" className={formData.pincode.length !== 6 ? "text-slate-400" : ""}>Address Label (e.g. Home, Office)</Label>
                      <Input
                        id="label"
                        disabled={formData.pincode.length !== 6}
                        value={formData.label}
                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                        placeholder="Home"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className={formData.pincode.length !== 6 ? "text-slate-400" : ""}>Recipient Name</Label>
                      <Input
                        id="full_name"
                        disabled={formData.pincode.length !== 6}
                        value={formData.full_name}
                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={formData.pincode.length !== 6 ? "text-slate-400" : ""}>Phone Number</Label>
                      <Input
                        id="phone"
                        disabled={formData.pincode.length !== 6}
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className={formData.pincode.length !== 6 ? "text-slate-400" : ""}>Full Address</Label>
                    <Textarea
                      id="address"
                      disabled={formData.pincode.length !== 6}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House No, Apartment, Street name..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className={formData.pincode.length !== 6 ? "text-slate-400" : ""}>City</Label>
                      <Input
                        id="city"
                        disabled={formData.pincode.length !== 6}
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className={formData.pincode.length !== 6 ? "text-slate-400" : ""}>State</Label>
                      <Input
                        id="state"
                        disabled={formData.pincode.length !== 6}
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {formData.pincode.length === 6 && (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 h-12 font-bold animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Address"}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-12 font-bold"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">No saved addresses found</p>
            <p className="text-slate-400 text-sm mt-1">Add your first address to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className={`group border-none shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${addr.is_default ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
            >
              <div className="p-5 flex flex-col h-full bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      {addr.label || "Home"}
                      {addr.is_default && (
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[8px] tracking-normal lowercase">default</span>
                      )}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{addr.full_name}</h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-slate-300" />
                    <p className="text-sm leading-relaxed">
                      {addr.address}, {addr.city}, {addr.state} - <span className="font-mono">{addr.pincode}</span>
                    </p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 pl-6">{addr.phone}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  {!addr.is_default ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-bold text-primary hover:bg-primary/5 px-3 rounded-lg"
                    >
                      Set as Default
                    </Button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Default Address
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
