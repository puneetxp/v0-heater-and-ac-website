"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Trash2, RefreshCw, ChevronDown, ChevronRight, Tags, ListTree, DollarSign } from "lucide-react";
import type { ApiService, ApiServicePlan, ApiServicePlanPrice } from "@/lib/intax/types";
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

  const toggleService = (id: number) => {
    setExpandedServices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRefresh = () => {
    mutateServices();
    mutatePlans();
    mutatePrices();
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

  const isLoading = servicesLoading || plansLoading || pricesLoading;
  const error = servicesError || plansError || pricesError;

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
          {services.map((service) => {
            const servicePlans = plans?.filter(p => p.service_id === service.id) || [];
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

                {/* Service Content (Plans & Prices) */}
                {isExpanded && (
                  <div className="p-4 bg-white space-y-4">
                    {servicePlans.length === 0 ? (
                      <p className="text-center text-sm text-slate-500 py-4 italic">No plans defined for this service</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {servicePlans.map(plan => {
                          const planPrices = prices?.filter(pr => pr.service_plan_id === plan.id) || [];
                          return (
                            <div key={plan.id} className="border rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-2 mb-3">
                                <ListTree className="h-4 w-4 text-blue-500" />
                                <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                              </div>
                              
                              <div className="space-y-2">
                                {planPrices.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 italic">No pricing configured</p>
                                ) : (
                                  planPrices.map(price => (
                                    <div key={price.id} className="flex flex-col p-2 bg-white rounded border border-slate-100 text-xs">
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-slate-600">{price.name || "Base Price"}</span>
                                        <span className="font-bold text-blue-600">₹{price.amount.toLocaleString()}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                        <DollarSign className="h-3 w-3" />
                                        <span>MRP: ₹{price.mrp.toLocaleString()}</span>
                                        <span>•</span>
                                        <span>GST: {price.gst_rate}%</span>
                                      </div>
                                      <div className="mt-1 text-[10px] text-slate-500 font-medium">
                                        Validity: {price.month ? `${price.month} Months` : price.day ? `${price.day} Days` : "Lifetime"}
                                      </div>
                                    </div>
                                  ))
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
