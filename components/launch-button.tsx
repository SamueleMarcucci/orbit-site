import Link from "next/link";
import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

type LaunchButtonProps = {
  variant?: "primary" | "secondary" | "quiet";
  children?: React.ReactNode;
  href?: string;
};

const variantClasses = {
  primary:
    "bg-[var(--green)] text-[#07100c] shadow-[0_18px_46px_oklch(0.78_0.15_162_/_0.22)] hover:bg-[oklch(0.84_0.13_162)]",
  secondary:
    "border border-[var(--line-strong)] bg-white/[0.055] text-[var(--text)] hover:bg-white/[0.09]",
  quiet: "text-[var(--muted)] hover:text-[var(--text)]"
};

export function LaunchButton({
  variant = "primary",
  children = "Join the launch list",
  href = site.launchHref
}: LaunchButtonProps) {
  const isMail = href.startsWith("mailto:");
  const Icon = isMail ? EnvelopeSimple : ArrowRight;

  return (
    <Link
      className={`focus-ring group inline-flex min-h-12 items-center gap-3 rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-out)] active:scale-[0.98] ${variantClasses[variant]}`}
      href={href}
    >
      <span>{children}</span>
      {variant !== "quiet" ? (
        <span className="grid size-8 place-items-center rounded-full bg-black/10 text-current transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
          <Icon size={16} weight="bold" />
        </span>
      ) : null}
    </Link>
  );
}
