"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Trash2, RefreshCw, ChevronDown, ChevronRight, Tags, ListTree, DollarSign, CheckCircle2 } from "lucide-react";
import type { ApiService, ApiServicePlan, ApiServicePlanPrice, ApiServiceAttribute, ApiServiceAttributeValue } from "@/lib/intax/types";
import { intaxGetAll, intaxDelete } from "@/lib/intax/client";

export function IntaxServicesView() {
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>({});

  const { data: services, error: servicesError, isLoading: servicesLoading, mutate: mutateServices } = useSWR<ApiService[]>(
    "intax_services",
    () => intaxGetAll<ApiService>("service"),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const { data: plans, error: plansError, isLoading: plansLoading, mutate: mutatePlans } = useSWR<ApiServicePlan[]>(
    "intax_service_plans",
    () => intaxGetAll<ApiServicePlan>("service_plan"),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const { data: prices, error: pricesError, isLoading: pricesLoading, mutate: mutatePrices } = useSWR<ApiServicePlanPrice[]>(
    "intax_service_prices",
    () => intaxGetAll<ApiServicePlanPrice>("service_plan_price"),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const { data: attributes, error: attributesError, isLoading: attributesLoading, mutate: mutateAttributes } = useSWR<ApiServiceAttribute[]>(
    "intax_service_attributes",
    () => intaxGetAll<ApiServiceAttribute>("service_attribute"),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const { data: attributeValues, error: attributeValuesError, isLoading: attributeValuesLoading, mutate: mutateAttributeValues } = useSWR<ApiServiceAttributeValue[]>(
    "intax_service_attribute_values",
    () => intaxGetAll<ApiServiceAttributeValue>("service_attribute_value"),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const toggleService = (id: number) => {
    setExpandedServices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRefresh = () => {
    mutateServices();
    mutatePlans();
    mutatePrices();
    mutateAttributes();
    mutateAttributeValues();
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service? All related plans and prices may be affected.")) return;
    try {
      const res = await intaxDelete<ApiService>("service", id);
      if (!res) throw new Error("Failed to delete service");
      handleRefresh();
    } catch (error: any) {
      alert(`Error deleting service: ${error.message}`);
    }
  };

  const [syncingId, setSyncingId] = useState<number | null>(null);

  const handleSync = async (service: ApiService, plan: ApiServicePlan, price: ApiServicePlanPrice) => {
    setSyncingId(price.id);
    try {
      const res = await fetch("/api/admin/intax/sync/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, plan, price }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      
      alert(`Successfully ${data.action} product: ${data.product.name}`);
    } catch (error: any) {
      alert(`Sync error: ${error.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  const isLoading = servicesLoading || plansLoading || pricesLoading || attributesLoading || attributeValuesLoading;
  const error = servicesError || plansError || pricesError || attributesError || attributeValuesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-900">Error Loading Services</p>
          <p className="text-red-700 text-sm">{(error as any).message || "Failed to fetch services data"}</p>
          <Button size="sm" variant="outline" onClick={handleRefresh} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Intax Services</h2>
          <p className="text-sm text-slate-500 mt-1">Manage services, tiered plans, and pricing from Intax ERP</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {!services || services.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed">
          <p className="text-slate-500">No services found in Intax</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.filter(s => s.enable === 1).map((service) => {
            const servicePlans = (plans?.filter(p => p.service_id === service.id && p.enable === 1) || []);
            const serviceAttrs = attributes?.filter(a => a.service_id === service.id && a.enable === 1) || [];
            const isExpanded = expandedServices[service.id];

            return (
              <div key={service.id} className="border rounded-xl bg-white shadow-sm overflow-hidden transition-all">
                {/* Service Header */}
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${isExpanded ? 'bg-slate-50/50 border-b' : ''}`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Tags className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{service.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">ID: #{service.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Plans</p>
                      <p className="text-sm font-bold text-slate-900">{servicePlans.length}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-red-600 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(service.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {isExpanded ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Service Content (Plans, Prices & Attributes) */}
                {isExpanded && (
                  <div className="p-4 bg-white space-y-4">
                    {servicePlans.length === 0 ? (
                      <p className="text-center text-sm text-slate-500 py-4 italic">No plans defined for this service</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servicePlans.map(plan => {
                          const planPrices = prices?.filter(pr => pr.service_plan_id === plan.id && pr.enable === 1) || [];
                          const planAttrValues = attributeValues?.filter(v => v.service_plan_id === plan.id && v.enable === 1) || [];
                          
                          return (
                            <div key={plan.id} className="flex flex-col border rounded-2xl p-5 bg-slate-50/30 hover:bg-slate-50/60 transition-all border-slate-100 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-white rounded-md border border-slate-200">
                                    <ListTree className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900">{plan.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-mono leading-none">ID: #{plan.id}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Prices Section */}
                              <div className="space-y-3 mb-5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  <DollarSign className="h-3 w-3" /> Pricing
                                </p>
                                {planPrices.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 italic px-2">No pricing configured</p>
                                ) : (
                                  planPrices.map(price => (
                                    <div key={price.id} className="group/price relative flex flex-col p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                                      <div className="flex justify-between items-center mb-1">
                                        <div>
                                          <span className="font-bold text-slate-700 text-xs">{price.name || "Default Tier"}</span>
                                          <p className="text-[8px] text-slate-300 font-mono leading-none">ID: #{price.id}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-black text-blue-600 text-sm">₹{price.amount.toLocaleString()}</span>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 opacity-0 group-hover/price:opacity-100 transition-opacity text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSync(service, plan, price);
                                            }}
                                            disabled={syncingId === price.id}
                                          >
                                            {syncingId === price.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                                        <div className="flex gap-2">
                                          <span className="line-through text-slate-300">₹{price.mrp.toLocaleString()}</span>
                                          <span className="bg-blue-50 text-blue-600 px-1.5 rounded-full font-bold">GST {price.gst_rate}%</span>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 px-1.5 rounded-full font-medium">
                                          {price.month ? `${price.month} Months` : price.day ? `${price.day} Days` : "Lifetime"}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* Features/Attributes Section */}
                              <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Features
                                </p>
                                {serviceAttrs.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 italic px-2">No attributes defined</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {serviceAttrs.map(attr => {
                                      const val = planAttrValues.find(v => v.service_attribute_id === attr.id);
                                      return (
                                        <li key={attr.id} className="flex items-start justify-between text-[11px]">
                                          <span className="text-slate-500">{attr.name}</span>
                                          <span className="font-bold text-slate-800 text-right">{val?.value || "—"}</span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
