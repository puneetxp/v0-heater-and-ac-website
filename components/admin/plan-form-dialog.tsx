"use client";

import type React from "react";

import { useState } from "react";
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

export function PlanFormDialog({ planId, isEdit }: PlanFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
        setOpen(false);
        // Refresh page or trigger refetch
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving plan:", error);
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
