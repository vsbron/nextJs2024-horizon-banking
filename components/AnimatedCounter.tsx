"use client";
import CountUp from "react-countup/";

function AnimatedCounter({ amount }: { amount: number }) {
  // Returned JSX
  return (
    <div className="w-full">
      <CountUp end={amount} prefix="$" decimals={2} decimal="," />
    </div>
  );
}

export default AnimatedCounter;
