"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";

interface PlanFormDialogProps {
  planId?: number;
  isEdit?: boolean;
}

interface FormData {
  name: string;
  description: string;
  season: string;
  base_price: string;
  pricing_per_unit: string;
  discount_percentage: string;
  duration_months: string;
  start_month: string;
  end_month: string;
}

export function PlanFormDialog({ planId, isEdit }: PlanFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    season: "summer",
    base_price: "",
    pricing_per_unit: "",
    discount_percentage: "",
    duration_months: "",
    start_month: "",
    end_month: "",
  });

  // Load plan data when editing
  useEffect(() => {
    if (isEdit && planId && open) {
      loadPlanData();
    }
  }, [isEdit, planId, open]);

  const loadPlanData = async () => {
    setLoadingPlan(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/plans/${planId}`);
      if (!response.ok) {
        throw new Error("Failed to load plan data");
      }
      const data = await response.json();
      setFormData({
        name: data.name || "",
        description: data.description || "",
        season: data.season || "summer",
        base_price: data.base_price?.toString() || "",
        pricing_per_unit: data.pricing_per_unit?.toString() || "",
        discount_percentage: data.discount_percentage?.toString() || "",
        duration_months: data.duration_months?.toString() || "",
        start_month: data.start_month?.toString() || "",
        end_month: data.end_month?.toString() || "",
      });
    } catch (err) {
      setError("Failed to load plan data");
      console.error("Error loading plan:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = isEdit
        ? `/api/admin/plans/${planId}`
        : "/api/admin/plans";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(isEdit ? "Plan updated successfully!" : "Plan created successfully!");
        setTimeout(() => {
          setOpen(false);
          // Refresh page to show updated data
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save plan");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      setError("An error occurred while saving the plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          {isEdit
            ? (
              <>
                <Edit className="h-4 w-4" />
                Edit
              </>
            )
            : (
              <>
                <Plus className="h-4 w-4" />
                Add Plan
              </>
            )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Plan" : "Create New Seasonal Plan"}
          </DialogTitle>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {loadingPlan && (
          <div className="text-center py-4">
            <p className="text-slate-600">Loading plan data...</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" style={{ display: loadingPlan ? 'none' : 'block' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Plan Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Cool - 3 Months"
                required
              />
            </div>
            <div>
              <Label>Season</Label>
              <select
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={formData.season}
                onChange={(e) =>
                  setFormData({ ...formData, season: e.target.value })}
              >
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
                <option value="year_round">Year Round</option>
                <option value="end_season">End Season Sale</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the plan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Base Price (₹)</Label>
              <Input
                type="number"
                value={formData.base_price}
                onChange={(e) =>
                  setFormData({ ...formData, base_price: e.target.value })}
                placeholder="5000"
                required
              />
            </div>
            <div>
              <Label>Price Per Unit (₹)</Label>
              <Input
                type="number"
                value={formData.pricing_per_unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricing_per_unit: e.target.value,
                  })}
                placeholder="1500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration (Months)</Label>
              <Input
                type="number"
                value={formData.duration_months}
                onChange={(e) =>
                  setFormData({ ...formData, duration_months: e.target.value })}
                placeholder="3"
                required
              />
            </div>
            <div>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_percentage: e.target.value,
                  })}
                placeholder="15"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Month (1-12)</Label>
              <Input
                type="number"
                value={formData.start_month}
                onChange={(e) =>
                  setFormData({ ...formData, start_month: e.target.value })}
                placeholder="3"
                min="1"
                max="12"
                required
              />
            </div>
            <div>
              <Label>End Month (1-12)</Label>
              <Input
                type="number"
                value={formData.end_month}
                onChange={(e) =>
                  setFormData({ ...formData, end_month: e.target.value })}
                placeholder="5"
                min="1"
                max="12"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? "Saving..." : isEdit ? "Update Plan" : "Create Plan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
