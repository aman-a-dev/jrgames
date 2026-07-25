import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AppPage() {
  return (
    <div className="mt-20">
      <Card>
        <CardHeader>
          <Image
            src="/cover.webp"
            className="w-full rounded"
            alt="Cover"
            width={100}
            height={100}
          />
        </CardHeader>
        <CardContent className="flex">
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href="/game/one">Play</Link>}
          />
        </CardContent>
      </Card>
    </div>
  );
}
