import Link from "next/link";
import Image from "next/image";

import { formatAmount } from "@/lib/utils";
import { CreditCardProps } from "@/types";

function BankCard({ account, userName, showBalance = true }: CreditCardProps) {
  return (
    <div className="flex flex-col">
      <Link href="/" className="bank-card">
        <div className="bank-card_content">
          <div>
            <h3 className="text-16 font-semibold text-white">{userName}</h3>
            <p className="font-ibm-plex-serif font-black text-white">
              {showBalance && formatAmount(account.currentBalance || 0)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h2 className="text-12 font-semibold text-white">{userName}</h2>
              <h3 className="text-12 font-semibold text-white">●● / ●●</h3>
            </div>
            <p className="text-12 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span className="text-16">1234</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image src="/icons/Paypass.svg" width={20} height={24} alt="Pay" />
          <Image
            src="/icons/mastercard.svg"
            width={40}
            height={25}
            alt="Mastercard"
          />
        </div>
        <Image
          src="/icons/lines.png"
          className="absolute right-0 top-0"
          width={316}
          height={119}
          alt="Lines"
        />
      </Link>
      {/* COPY */}
    </div>
  );
}

export default BankCard;
