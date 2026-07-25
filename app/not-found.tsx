import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

import { HomeIcon, CompassIcon } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-9xl">
            404
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
            The page you&apos;re looking for might have been <br />
            moved or doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button render={<Link href="/" />} nativeButton={false}>
              <HomeIcon data-icon="inline-start" />
              Go Home
            </Button>

            <Button
              variant="outline"
              render={<Link href="/home" />}
              nativeButton={false}
            >
              <CompassIcon data-icon="inline-start" /> Explore
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
