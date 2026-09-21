"use client";
import BloodRequestActions from "@/components/blood-request/card/BloodRequestActions";
import { Button } from "@/components/ui/button";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BloodRequestDetailHeader({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const router = useRouter();
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Button>

      <BloodRequestActions request={request} />
    </div>
  );
}
