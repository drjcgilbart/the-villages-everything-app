"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import {
  DEFAULT_ZIP,
  OTHER_VILLAGE,
  OTHER_ZIP,
  VILLAGES_CITY,
  VILLAGES_STATE,
  composeHouseAddress,
  isFiveDigitZip,
  isVillageName,
  canonicalVillageName,
  splitHouseAddress,
  villageChoices,
  zipChoices,
} from "@/lib/houseAddress";

/**
 * Street, village, locked city, locked state, and ZIP.
 * A village or ZIP that is not on the list is typed underneath and stays pending until an admin approves it.
 */
export function HouseAddressFields({
  address,
  resetKey,
  approvedZips,
  approvedVillages,
  onAddress,
  idPrefix,
  streetRef,
  otherHint,
  villageHint,
}: {
  address: string;
  resetKey: string;
  approvedZips: readonly string[];
  approvedVillages: readonly string[];
  onAddress: (address: string) => void;
  idPrefix: string;
  streetRef?: Ref<HTMLInputElement>;
  otherHint: string;
  villageHint: string;
}) {
  const [street, setStreet] = useState("");
  const [zipSelect, setZipSelect] = useState(DEFAULT_ZIP);
  const [customZip, setCustomZip] = useState("");
  const [villageSelect, setVillageSelect] = useState("");
  const [customVillage, setCustomVillage] = useState("");
  const emitted = useRef<string | null>(null);
  const appliedKey = useRef("");
  const onAddressRef = useRef(onAddress);
  const choicesRef = useRef(approvedZips);
  const villagesRef = useRef(approvedVillages);
  onAddressRef.current = onAddress;
  choicesRef.current = approvedZips;
  villagesRef.current = approvedVillages;
  const choices = zipChoices(approvedZips, zipSelect === OTHER_ZIP ? "" : zipSelect);
  const villagePick = villageSelect === OTHER_VILLAGE ? "" : villageSelect;
  const villages = villageChoices(approvedVillages, villagePick);

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
    const knownVillages = villageChoices(villagesRef.current);
    let nextVillage = "";
    let nextCustomVillage = "";
    if (parts.village) {
      const match = knownVillages.find(
        (name) => name.localeCompare(parts.village, "en", { sensitivity: "base" }) === 0
      );
      if (match) nextVillage = match;
      else {
        nextVillage = OTHER_VILLAGE;
        nextCustomVillage = parts.village;
      }
    }
    const zip = select === OTHER_ZIP ? custom : select;
    const village = nextVillage === OTHER_VILLAGE ? nextCustomVillage : nextVillage;
    const next = composeHouseAddress(parts.street, isFiveDigitZip(zip) ? zip : "", village);
    const shown = next ? splitHouseAddress(next).street : "";
    setStreet(shown);
    setZipSelect(select);
    setCustomZip(custom);
    setVillageSelect(nextVillage);
    setCustomVillage(nextCustomVillage);
    emitted.current = next;
    if (next !== address) onAddressRef.current(next);
  }, [address, resetKey]);

  useEffect(() => {
    if (zipSelect !== OTHER_ZIP || !isFiveDigitZip(customZip)) return;
    if (!zipChoices(approvedZips).includes(customZip)) return;
    setZipSelect(customZip);
    setCustomZip("");
  }, [approvedZips, zipSelect, customZip]);

  useEffect(() => {
    if (villageSelect !== OTHER_VILLAGE || !isVillageName(customVillage)) return;
    const match = villageChoices(approvedVillages).find(
      (name) => name.localeCompare(customVillage, "en", { sensitivity: "base" }) === 0
    );
    if (!match) return;
    setVillageSelect(match);
    setCustomVillage("");
  }, [approvedVillages, villageSelect, customVillage]);

  function publish(
    nextStreet: string,
    select: string,
    custom: string,
    nextVillage: string,
    nextCustomVillage: string
  ) {
    const zip = select === OTHER_ZIP ? (isFiveDigitZip(custom) ? custom : "") : select;
    const village =
      nextVillage === OTHER_VILLAGE
        ? isVillageName(nextCustomVillage)
          ? canonicalVillageName(nextCustomVillage)
          : ""
        : nextVillage;
    const next = composeHouseAddress(nextStreet, zip, village);
    emitted.current = next;
    onAddressRef.current(next);
  }

  return (
    <>
      <div className="lt-address-street-row">
        <div className="field">
          <label htmlFor={`${idPrefix}-address`}>Address</label>
          <input
            id={`${idPrefix}-address`}
            ref={streetRef}
            value={street}
            maxLength={100}
            autoComplete="address-line1"
            placeholder="1234 Example Lane."
            onChange={(event) => {
              const next = event.target.value;
              setStreet(next);
              publish(next, zipSelect, customZip, villageSelect, customVillage);
            }}
          />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-village`}>Village</label>
          <select
            id={`${idPrefix}-village`}
            value={villageSelect === OTHER_VILLAGE || villages.includes(villageSelect) ? villageSelect : ""}
            onChange={(event) => {
              const select = event.target.value;
              setVillageSelect(select);
              if (select !== OTHER_VILLAGE) setCustomVillage("");
              publish(street, zipSelect, customZip, select, select === OTHER_VILLAGE ? customVillage : "");
            }}
          >
            <option value="">Choose a village</option>
            {villages.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value={OTHER_VILLAGE}>Add another village</option>
          </select>
        </div>
      </div>
      {villageSelect === OTHER_VILLAGE ? (
        <div className="field">
          <label htmlFor={`${idPrefix}-village-other`}>Other village</label>
          <input
            id={`${idPrefix}-village-other`}
            maxLength={40}
            autoComplete="off"
            value={customVillage}
            placeholder="Village name"
            onChange={(event) => {
              const custom = event.target.value.replace(/[^A-Za-z0-9 .'\u2019-]/g, "").slice(0, 40);
              setCustomVillage(custom);
              publish(street, zipSelect, customZip, OTHER_VILLAGE, custom);
            }}
          />
          <p className="panel-hint">{villageHint}</p>
        </div>
      ) : null}
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
            publish(street, select, select === OTHER_ZIP ? customZip : "", villageSelect, customVillage);
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
              publish(street, OTHER_ZIP, custom, villageSelect, customVillage);
            }}
          />
          <p className="panel-hint">{otherHint}</p>
        </div>
      ) : null}
    </>
  );
}
