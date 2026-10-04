"use client";

import { Megaphone, Plus, Send } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/stat-card";
import { Badge, Button, Card } from "@/components/ui";

const CAMPAIGNS = [
  { name: "Weekend Flash Sale", channel: "SMS", status: "Active", sent: "1,240" },
  { name: "Loyalty Rewards Blast", channel: "Email", status: "Scheduled", sent: "3,860" },
  { name: "Monsoon Spa Offer", channel: "Push", status: "Draft", sent: "—" },
];

export default function MarketingPage() {
  return (
    <div>
      <AdminPageHeader
        title="Marketing"
        description="Reach your customers with targeted campaigns."
        action={
          <Button>
            <Plus className="size-4" />
            New Campaign
          </Button>
        }
      />

      <div className="grid gap-3 lg:grid-cols-3">
        {CAMPAIGNS.map((campaign) => (
          <Card key={campaign.name} className="p-4">
            <div className="flex items-start justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-cream-100 text-ink-800">
                <Megaphone className="size-5" />
              </span>
              <Badge
                tone={
                  campaign.status === "Active"
                    ? "green"
                    : campaign.status === "Scheduled"
                      ? "blue"
                      : "neutral"
                }
              >
                {campaign.status}
              </Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-ink-900">
              {campaign.name}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-700/50">
              {campaign.channel} · {campaign.sent} sent
            </p>
            <Button variant="soft" size="sm" className="mt-3 w-full">
              <Send className="size-3.5" />
              View report
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
