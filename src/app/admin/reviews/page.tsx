"use client";

import { Star } from "lucide-react";
import { AdminPageHeader, StatCard } from "@/components/admin/stat-card";
import { Avatar, Card, StarRating } from "@/components/ui";
import { useDB } from "@/lib/hooks";

const REVIEWS = [
  { name: "Aarav Sharma", rating: 5, text: "Best fade in the city. Super clean and professional.", service: "Skin Fade" },
  { name: "Dev Patel", rating: 5, text: "Loved the ambience and the head massage. Highly recommend.", service: "Head Massage" },
  { name: "Karan Malhotra", rating: 4, text: "Quick service, friendly staff, fair prices.", service: "Classic Haircut" },
  { name: "Rahul Verma", rating: 5, text: "Aman is a genius with the clippers. Will be back.", service: "Beard Trim" },
];

export default function ReviewsPage() {
  const db = useDB();
  const avg =
    db.stylists.reduce((s, x) => s + x.rating, 0) /
    Math.max(db.stylists.length, 1);

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description="What your customers are saying."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Average Rating" value={avg.toFixed(1)} delta="+0.2 this month" icon={<Star className="size-4" />} />
        <StatCard label="Total Reviews" value="1,248" delta="+46 this month" />
        <StatCard label="5-Star Reviews" value="892" delta="71% of total" />
        <StatCard label="Response Rate" value="94%" delta="+6% this month" />
      </div>

      <div className="mt-5 space-y-3">
        {REVIEWS.map((review) => (
          <Card key={review.name} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar
                src={`https://i.pravatar.cc/200?u=${encodeURIComponent(review.name)}`}
                alt={review.name}
                size={40}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-900">
                    {review.name}
                  </p>
                  <StarRating value={review.rating} />
                </div>
                <p className="mt-1.5 text-xs text-ink-700/70">{review.text}</p>
                <p className="mt-1.5 text-[11px] text-ink-700/45">
                  {review.service}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
