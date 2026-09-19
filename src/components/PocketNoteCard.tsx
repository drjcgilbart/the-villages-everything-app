"use client";

export function PocketNoteCard({
  heading = "Pocket note",
  hint,
  placeholder,
  value,
  maxLength = 800,
  onChange,
  onSave,
  savedLabel,
  saving,
}: {
  heading?: string;
  hint: string;
  placeholder: string;
  value: string;
  maxLength?: number;
  onChange: (next: string) => void;
  onSave: () => void;
  savedLabel?: string | null;
  saving?: boolean;
}) {
  return (
    <article className="about-panel pocket-note-card">
      <h3 style={{ marginTop: 0 }}>{heading}</h3>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        {hint}
      </p>
      <textarea
        rows={3}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
      />
      <div className="wealth-tool-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save note"}
        </button>
        <span className="panel-hint" style={{ margin: 0 }}>
          {value.length}/{maxLength}
        </span>
        {savedLabel ? <span className="wealth-saved">{savedLabel}</span> : null}
      </div>
    </article>
  );
}
