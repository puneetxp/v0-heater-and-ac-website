"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Edit2, Plus, Trash2, X } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  capacity: string;
  color?: string;
  specifications: Record<string, string>;
  priceMultiplier?: number;
  isActive: boolean;
}

interface Plan {
  id: string;
  name: string;
  durationMonths: number;
  discountPercentage: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

interface AdminVariantManagerProps {
  productId: string;
  variants: Variant[];
  plans: Plan[];
  onVariantAdd?: (variant: Variant) => void;
  onVariantEdit?: (id: string, variant: Variant) => void;
  onVariantDelete?: (id: string) => void;
  onPlanAdd?: (plan: Plan) => void;
  onPlanEdit?: (id: string, plan: Plan) => void;
  onPlanDelete?: (id: string) => void;
}

export function AdminVariantManager({
  productId,
  variants: initialVariants = [],
  plans: initialPlans = [],
  onVariantAdd: externalOnVariantAdd,
  onVariantEdit: externalOnVariantEdit,
  onVariantDelete: externalOnVariantDelete,
  onPlanAdd: externalOnPlanAdd,
  onPlanEdit: externalOnPlanEdit,
  onPlanDelete: externalOnPlanDelete,
}: AdminVariantManagerProps) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);

  // Internal handlers to replace optional props
  const onVariantAdd = externalOnVariantAdd || ((v: Variant) => {
    setVariants([...variants, v]);
    console.log("Added variant internally:", v);
  });

  const onVariantEdit = externalOnVariantEdit || ((id: string, v: Variant) => {
    setVariants(variants.map((varitem) => varitem.id === id ? v : varitem));
    console.log("Edited variant internally:", id, v);
  });

  const onVariantDelete = externalOnVariantDelete || ((id: string) => {
    setVariants(variants.filter((varitem) => varitem.id !== id));
    console.log("Deleted variant internally:", id);
  });

  const onPlanAdd = externalOnPlanAdd || ((p: Plan) => {
    setPlans([...plans, p]);
    console.log("Added plan internally:", p);
  });

  const onPlanEdit = externalOnPlanEdit || ((id: string, p: Plan) => {
    setPlans(plans.map((planItem) => planItem.id === id ? p : planItem));
    console.log("Edited plan internally:", id, p);
  });

  const onPlanDelete = externalOnPlanDelete || ((id: string) => {
    setPlans(plans.filter((planItem) => planItem.id !== id));
    console.log("Deleted plan internally:", id);
  });

  return (
    <Tabs defaultValue="variants" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="variants">Variants</TabsTrigger>
        <TabsTrigger value="plans">Service Plans</TabsTrigger>
      </TabsList>

      {/* Variants Tab */}
      <TabsContent value="variants" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Product Variants</h3>
            <p className="text-sm text-muted-foreground">
              Manage different capacities and configurations
            </p>
          </div>
          <Button
            onClick={() =>
              onVariantAdd?.({
                id: Date.now().toString(),
                name: "",
                capacity: "",
                specifications: {},
                isActive: true,
              })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
          </Button>
        </div>

        <div className="grid gap-4">
          {variants.length === 0
            ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No variants yet. Add your first variant to get started.
                  </p>
                </CardContent>
              </Card>
            )
            : (
              variants.map((variant) => (
                <Card
                  key={variant.id}
                  className={editingVariant === variant.id
                    ? "ring-2 ring-primary"
                    : ""}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {variant.name || "Unnamed Variant"}
                        </CardTitle>
                        <CardDescription>{variant.capacity}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {variant.isActive
                          ? <Badge className="bg-green-600">Active</Badge>
                          : <Badge variant="secondary">Inactive</Badge>}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditingVariant(
                              editingVariant === variant.id ? null : variant.id,
                            )}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onVariantDelete?.(variant.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {editingVariant === variant.id && (
                    <CardContent className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            defaultValue={variant.name}
                            placeholder="e.g., 1.5 Ton Inverter"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Capacity
                          </label>
                          <Input
                            defaultValue={variant.capacity}
                            placeholder="e.g., 1.5 Ton"
                          />
                        </div>
                        {variant.color && (
                          <div>
                            <label className="text-sm font-medium">Color</label>
                            <Input
                              defaultValue={variant.color}
                              placeholder="e.g., White"
                            />
                          </div>
                        )}
                        {variant.priceMultiplier && (
                          <div>
                            <label className="text-sm font-medium">
                              Price Multiplier
                            </label>
                            <Input
                              type="number"
                              defaultValue={variant.priceMultiplier}
                              step="0.1"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          size="sm"
                          onClick={() => {
                            onVariantEdit?.(variant.id, variant);
                            setEditingVariant(null);
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingVariant(null)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  )}

                  {editingVariant !== variant.id && (
                    <CardContent className="text-sm text-muted-foreground">
                      {Object.keys(variant.specifications || {}).length > 0 && (
                        <div className="space-y-1">
                          {Object.entries(variant.specifications).map((
                            [key, value],
                          ) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))
            )}
        </div>
      </TabsContent>

      {/* Plans Tab */}
      <TabsContent value="plans" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Service Plans</h3>
            <p className="text-sm text-muted-foreground">
              Manage rental durations and pricing plans
            </p>
          </div>
          <Button
            onClick={() =>
              onPlanAdd?.({
                id: Date.now().toString(),
                name: "",
                durationMonths: 1,
                discountPercentage: 0,
                features: [],
                isPopular: false,
                isActive: true,
              })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <div className="grid gap-4">
          {plans.length === 0
            ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No plans yet. Add your first service plan to get started.
                  </p>
                </CardContent>
              </Card>
            )
            : (
              plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={editingPlan === plan.id
                    ? "ring-2 ring-primary"
                    : ""}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {plan.name || "Unnamed Plan"}
                        </CardTitle>
                        <CardDescription>
                          {plan.durationMonths}{" "}
                          month{plan.durationMonths > 1 ? "s" : ""}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.isPopular && (
                          <Badge className="bg-amber-600">Popular</Badge>
                        )}
                        {plan.isActive
                          ? <Badge className="bg-green-600">Active</Badge>
                          : <Badge variant="secondary">Inactive</Badge>}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingPlan(
                            editingPlan === plan.id ? null : plan.id,
                          )}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPlanDelete?.(plan.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {editingPlan === plan.id && (
                    <CardContent className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Plan Name
                          </label>
                          <Input
                            defaultValue={plan.name}
                            placeholder="e.g., Monthly Plan"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Duration (Months)
                          </label>
                          <Input
                            type="number"
                            defaultValue={plan.durationMonths}
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Discount %
                          </label>
                          <Input
                            type="number"
                            defaultValue={plan.discountPercentage}
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          size="sm"
                          onClick={() => {
                            onPlanEdit?.(plan.id, plan);
                            setEditingPlan(null);
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPlan(null)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  )}

                  {editingPlan !== plan.id && (
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      {plan.discountPercentage > 0 && (
                        <div className="text-green-600 dark:text-green-400 font-medium">
                          Save {plan.discountPercentage}% with this plan
                        </div>
                      )}
                      {plan.features && plan.features.length > 0 && (
                        <div>
                          <div className="font-medium text-foreground mb-1">
                            Features:
                          </div>
                          <ul className="list-disc list-inside space-y-0.5">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="text-xs">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))
            )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
