import type { ContactBy } from "@/lib/yardSaleTypes";

const OPTIONS = [
  ["phone", "Phone"],
  ["email", "Email"],
  ["text", "Text"],
] as const;

export function ContactChoices({
  value,
  onChange,
}: {
  value: ContactBy;
  onChange: (next: ContactBy) => void;
}) {
  return (
    <div className="field">
      <span className="field-label">Preferred contact</span>
      <div className="contact-choices" role="group" aria-label="Preferred contact">
        {OPTIONS.map(([key, label]) => (
          <label key={key} className="checkbox-row">
            <input
              type="checkbox"
              checked={value[key]}
              onChange={() => onChange({ ...value, [key]: !value[key] })}
            />
            {label}
          </label>
        ))}
      </div>
      <p className="panel-hint">Choose at least one. You can choose two or all three.</p>
    </div>
  );
}
