type DiveLoaderProps = {
  progress: number;
  visible: boolean;
};

export default function DiveLoader({ progress, visible }: DiveLoaderProps) {
  const percentage = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div
      className="dive-loader"
      data-visible={visible}
      role="status"
      aria-live="polite"
      aria-label={`Preparing the dive, ${percentage}% complete`}
    >
      <div className="dive-loader-bubbles" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p>PREPARING THE DIVE</p>
      <strong>{String(percentage).padStart(3, "0")}%</strong>
      <span className="dive-loader-track" aria-hidden="true">
        <i style={{ transform: `scaleX(${percentage / 100})` }} />
      </span>
    </div>
  );
}
