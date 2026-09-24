import { BloodRequestDetailDonor } from "@/types/blood-request.type";
import Image from "next/image";
import Link from "next/link";

export default function DonorAvatar({
  donor,
}: {
  donor: BloodRequestDetailDonor;
}) {
  return (
    <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted">
      {donor.image ? (
        <Link href={`/user/${donor.username}`}>
          <Image
            src={donor.image}
            alt={donor.name}
            fill
            sizes="44px"
            className="object-cover"
          />{" "}
        </Link>
      ) : (
        <div className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
          {donor.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
