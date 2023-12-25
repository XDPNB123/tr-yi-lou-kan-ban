import { Button } from "@/components/button/Button";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import Link from "next/link";

export default function Home() {
  return (
    <div className=" h-screen  flex justify-center items-center text-center">
      <div>
        <div className="text-9xl font-bold ">同日 MES 看板系统</div>
        <div className="mt-32">
          <Link href="/work-order">
            <Button size="lg" className="mx-3">
              <ClipboardDocumentListIcon className="w-6 h-6 mr-3" />
              工单看板
            </Button>
          </Link>

          <Link href="/work-order">
            <Button size="lg" className="mx-3">
              <ClockIcon className="w-6 h-6 mr-3" />
              工时看板
            </Button>
          </Link>

          <Link href="/work-order">
            <Button size="lg" className="mx-3">
              <ClockIcon className="w-6 h-6 mr-3" />
              状态看板
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
