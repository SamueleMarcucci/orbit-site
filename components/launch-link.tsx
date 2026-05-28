import { launchHref } from "@/lib/site";

type LaunchLinkProps = {
  label?: string;
  className?: string;
};

export function LaunchLink({ label = "Join launch list", className = "" }: LaunchLinkProps) {
  return (
    <a className={`launch-link ${className}`} href={launchHref}>
      <span>{label}</span>
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}
