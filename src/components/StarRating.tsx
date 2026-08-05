export function StarRating({
  value,
  size = "md",
  showValue = false,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.4 && value - full < 0.9;
  const stars = [1, 2, 3, 4, 5];

  return (
    <span className={`star-rating star-rating-${size}`} aria-label={`${value} out of 5 stars`}>
      {stars.map((n) => {
        let cls = "star empty";
        if (n <= full) cls = "star full";
        else if (n === full + 1 && half) cls = "star half";
        return (
          <span key={n} className={cls} aria-hidden="true">
            ★
          </span>
        );
      })}
      {showValue && <span className="star-rating-num">{value ? value.toFixed(1) : "—"}</span>}
    </span>
  );
}

export function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          className={n <= value ? "active" : ""}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
