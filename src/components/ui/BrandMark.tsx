import { companyAssets } from "../../lib/companyAssets";

type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark-compact" : ""}`}>
      {companyAssets.octagramLogo ? (
        <img src={companyAssets.octagramLogo} alt="" decoding="async" />
      ) : (
        <span className="brand-mark-fallback" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      {!compact ? <strong>OCTAGRAM</strong> : null}
    </span>
  );
}
