"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import {
  DEFAULT_ZIP,
  OTHER_ZIP,
  VILLAGES_CITY,
  VILLAGES_STATE,
  composeHouseAddress,
  isFiveDigitZip,
  splitHouseAddress,
  zipChoices,
} from "@/lib/houseAddress";

/**
 * Street, locked city, locked state, and ZIP.
 * A ZIP that is not on the list is typed under Add another ZIP.
 */
export function HouseAddressFields({
  address,
  resetKey,
  approvedZips,
  onAddress,
  idPrefix,
  streetRef,
  otherHint,
}: {
  address: string;
  resetKey: string;
  approvedZips: readonly string[];
  onAddress: (address: string) => void;
  idPrefix: string;
  streetRef?: Ref<HTMLInputElement>;
  otherHint: string;
}) {
  const [street, setStreet] = useState("");
  const [zipSelect, setZipSelect] = useState(DEFAULT_ZIP);
  const [customZip, setCustomZip] = useState("");
  const emitted = useRef<string | null>(null);
  const appliedKey = useRef("");
  const onAddressRef = useRef(onAddress);
  const choicesRef = useRef(approvedZips);
  onAddressRef.current = onAddress;
  choicesRef.current = approvedZips;
  const choices = zipChoices(approvedZips, zipSelect === OTHER_ZIP ? "" : zipSelect);

  useEffect(() => {
    if (emitted.current === address && appliedKey.current === resetKey) return;
    appliedKey.current = resetKey;
    const parts = splitHouseAddress(address);
    const known = zipChoices(choicesRef.current);
    let select = DEFAULT_ZIP;
    let custom = "";
    if (parts.zip && !known.includes(parts.zip)) {
      select = OTHER_ZIP;
      custom = parts.zip;
    } else if (parts.zip && known.includes(parts.zip)) {
      select = parts.zip;
    }
    setStreet(parts.street);
    setZipSelect(select);
    setCustomZip(custom);
    const zip = select === OTHER_ZIP ? custom : select;
    const next = composeHouseAddress(parts.street, isFiveDigitZip(zip) ? zip : "");
    emitted.current = next;
    if (next !== address) onAddressRef.current(next);
  }, [address, resetKey]);

  useEffect(() => {
    if (zipSelect !== OTHER_ZIP || !isFiveDigitZip(customZip)) return;
    if (!zipChoices(approvedZips).includes(customZip)) return;
    setZipSelect(customZip);
    setCustomZip("");
  }, [approvedZips, zipSelect, customZip]);

  function publish(nextStreet: string, select: string, custom: string) {
    const zip = select === OTHER_ZIP ? (isFiveDigitZip(custom) ? custom : "") : select;
    const next = composeHouseAddress(nextStreet, zip);
    emitted.current = next;
    onAddressRef.current(next);
  }

  return (
    <>
      <div className="field">
        <label htmlFor={`${idPrefix}-address`}>Address</label>
        <input
          id={`${idPrefix}-address`}
          ref={streetRef}
          value={street}
          maxLength={140}
          autoComplete="address-line1"
          placeholder="3129 Hutchinson Way"
          onChange={(event) => {
            const next = event.target.value;
            setStreet(next);
            publish(next, zipSelect, customZip);
          }}
        />
      </div>
      <div className="lt-address-grid">
        <div className="field">
          <label htmlFor={`${idPrefix}-city`}>City</label>
          <select id={`${idPrefix}-city`} value={VILLAGES_CITY} disabled>
            <option value={VILLAGES_CITY}>{VILLAGES_CITY}</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-state`}>State</label>
          <select id={`${idPrefix}-state`} value={VILLAGES_STATE} disabled>
            <option value={VILLAGES_STATE}>{VILLAGES_STATE}</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-zip`}>ZIP</label>
        <select
          id={`${idPrefix}-zip`}
          value={choices.includes(zipSelect) || zipSelect === OTHER_ZIP ? zipSelect : DEFAULT_ZIP}
          onChange={(event) => {
            const select = event.target.value;
            setZipSelect(select);
            if (select !== OTHER_ZIP) setCustomZip("");
            publish(street, select, select === OTHER_ZIP ? customZip : "");
          }}
        >
          {choices.map((zip) => (
            <option key={zip} value={zip}>
              {zip}
            </option>
          ))}
          <option value={OTHER_ZIP}>Add another ZIP</option>
        </select>
      </div>
      {zipSelect === OTHER_ZIP ? (
        <div className="field">
          <label htmlFor={`${idPrefix}-zip-other`}>Other ZIP</label>
          <input
            id={`${idPrefix}-zip-other`}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={customZip}
            placeholder="5 digits"
            onChange={(event) => {
              const custom = event.target.value.replace(/\D/g, "").slice(0, 5);
              setCustomZip(custom);
              publish(street, OTHER_ZIP, custom);
            }}
          />
          <p className="panel-hint">{otherHint}</p>
        </div>
      ) : null}
    </>
  );
}
