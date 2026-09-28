"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CruiseHarbor } from "@/components/CruiseHarbor";
import { CruiseSailings } from "@/components/CruiseSailings";

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type CruiseCard = {
  id: string;
  name: string;
  drive: string;
  who: string;
  blurb: string;
  more: string;
  tips: string[];
  query: string;
  image: string;
  site?: { href: string; label: string };
};

type Group = {
  id: string;
  title: string;
  image: string;
  lead: string;
  places: CruiseCard[];
};

const GROUPS: Group[] = [
  {
    id: "ports",
    title: "Florida ports from The Villages",
    image: "/graphics/cruises/canaveral.jpg",
    lead: "Drive times start from the middle of town. Ships change. The port does not.",
    places: [
      {
        id: "canaveral",
        name: "Port Canaveral",
        drive: "About 1 hour 45 minutes · Cape Canaveral",
        who: "The Villages home port",
        image: "/graphics/cruises/canaveral.jpg",
        blurb:
          "The one you can drive to after breakfast and still make an afternoon sail. Disney, Carnival, Royal Caribbean, Norwegian, and MSC all use it.",
        more: "Port Canaveral is the practical cruise port for The Villages. Take State Road 50 east, or I-4 to the 528. The terminals sit on the Atlantic side of the Banana River, with parking garages a short walk or tram from the ship. Disney Cruise Line treats this as a home port, and the big family ships are a regular sight. Carnival, Royal Caribbean, Norwegian, and MSC sail from here too. Which ship is in which terminal changes every week, so the port’s site and your documents win over memory. A morning arrival back in port often means you are in your own driveway for dinner. That is the whole argument for Canaveral.",
        tips: [
          "Do online check-in and pick an arrival window. Dawn at the garage does not make the ship sail sooner.",
          "Reserve port parking when you book. The closest garage fills.",
          "A same-day drive home works when the ship docks in the morning. Don’t plan a same-day flight.",
        ],
        query: "Port Canaveral cruise terminal Florida",
        site: { href: "https://www.portcanaveral.com/", label: "Port Canaveral" },
      },
      {
        id: "tampa",
        name: "Port Tampa Bay",
        drive: "About 2 hours · Tampa",
        who: "A Gulf sailing",
        image: "/graphics/cruises/tampa.jpg",
        blurb:
          "The west-coast port. Carnival, Royal Caribbean, Celebrity, and Norwegian use the terminals by the downtown waterfront.",
        more: "Tampa’s cruise terminals sit on the downtown waterfront, about two hours down I-75. It is the Gulf sailing: western Caribbean, and sometimes a shorter loop that never fights Atlantic traffic. Parking is in port garages. The drop-off is straightforward if you arrive in your assigned window. Tampa is a good choice when Canaveral’s weekend you want is sold out, or when the group would rather drive south than east. Confirm the terminal number the night before. They are not interchangeable.",
        tips: [
          "I-75 on a Friday afternoon is not a two-hour drive. Leave earlier than the map says.",
          "The terminal number is on your documents. Set the GPS to that terminal.",
          "Downtown Tampa is an easy night-before hotel if the sail is early.",
        ],
        query: "Port Tampa Bay cruise terminals",
        site: { href: "https://www.porttb.com/", label: "Port Tampa Bay" },
      },
      {
        id: "jacksonville",
        name: "JAXPORT",
        drive: "About 2 hours 15 minutes · Jacksonville",
        who: "A smaller terminal",
        image: "/graphics/cruises/jacksonville.jpg",
        blurb:
          "The quiet one. Carnival has been the regular ship here. Fewer terminals, an easier morning, and a straight shot up the state.",
        more: "Jacksonville’s cruise terminal is smaller than Miami’s on purpose. Carnival has been the line most Villages neighbors will find sailing from JAXPORT. The drive is a bit over two hours, up through Ocala or out to I-95. Because the terminal is not a city of ships, embarkation morning is calmer. The tradeoff is choice: fewer ships and fewer week choices. Look up the current sailing before you tell the group Jacksonville is the plan. A ship that used to leave here may have moved.",
        tips: [
          "Confirm the ship still sails from Jacksonville this season.",
          "The drive is simpler than Miami and the terminal is smaller.",
          "Same rule as Canaveral: a morning return can be a same-day drive home.",
        ],
        query: "JAXPORT cruise terminal Jacksonville Florida",
        site: { href: "https://www.jaxport.com/", label: "JAXPORT" },
      },
      {
        id: "everglades",
        name: "Port Everglades",
        drive: "About 4 hours · Fort Lauderdale",
        who: "The overnight-before port",
        image: "/graphics/cruises/everglades.jpg",
        blurb:
          "Fort Lauderdale’s port. Celebrity, Royal Caribbean, Holland America, Princess, Disney, and Carnival use it. Plan a hotel the night before.",
        more: "Port Everglades is the Fort Lauderdale cruise port, not the beach you see from the hotel balcony. It is about four hours from The Villages on the Turnpike, and that drive the morning of the sail is how people miss the ship. Stay the night before, close to the port, not in western Broward. This is where a lot of the premium ships sail from: Celebrity, Holland America, Princess, Royal Caribbean, plus Disney and Carnival. Parking is on the port site. A flight home the afternoon you dock is a gamble. Ships are late. Customs lines are real.",
        tips: [
          "Hotel the night before. Do not invent a 5 a.m. hero drive.",
          "The port is not the beach. Put the terminal in the GPS, not ‘Fort Lauderdale.’",
          "Do not book a same-day flight out.",
        ],
        query: "Port Everglades cruise terminal Fort Lauderdale",
        site: { href: "https://www.porteverglades.net/", label: "Port Everglades" },
      },
      {
        id: "miami",
        name: "PortMiami",
        drive: "About 4 hours 15 minutes · Miami",
        who: "The busiest cruise port",
        image: "/graphics/cruises/miami.jpg",
        blurb:
          "The big one. Royal Caribbean, Carnival, Norwegian, MSC, Virgin, and Celebrity. Worth it for the ship you want. Not worth it as a same-morning surprise.",
        more: "PortMiami is the busiest cruise port in the world, on a causeway in the middle of Biscayne Bay. Royal Caribbean, Carnival, Norwegian, MSC, Virgin, and Celebrity all have ships here, and the terminal you want is one building in a row of them. The drive from The Villages is a real half day. Treat it like Port Everglades: hotel nearby the night before, online check-in done, arrival window respected. The ship you specifically wanted often sails from Miami and nowhere else in Florida. That is the reason to make the drive. Coming home, give yourself a night or a next-day flight.",
        tips: [
          "Set the GPS to your terminal, not ‘Port of Miami.’",
          "Friday traffic on the Turnpike is part of the trip. Leave the day before.",
          "A passport book is the calm choice if a flight home becomes the backup plan.",
        ],
        query: "PortMiami cruise terminals",
        site: { href: "https://www.portmiami.biz/", label: "PortMiami" },
      },
    ],
  },
  {
    id: "papers",
    title: "Papers, packing, and the morning of",
    image: "/graphics/cruises/packing.jpg",
    lead: "The ship is the easy part. The folder on the kitchen counter is the trip.",
    places: [
      {
        id: "documents",
        name: "What to carry",
        drive: "Before you book the cabin",
        who: "Every person, including children",
        image: "/graphics/cruises/packing.jpg",
        blurb:
          "A closed-loop cruise can sail on a birth certificate and a photo ID. A passport book is still the document that saves a ruined flight home.",
        more: "Most sailings from these Florida ports start and end at the same U.S. port. That is a closed-loop cruise. U.S. citizens on a closed-loop sailing may board with a government photo ID and an official birth certificate instead of a passport. A passport card works for that sea trip and does not work for an international flight. Children need their own documents. A parent’s passport does not cover a child. If the ship is diverted, or you have to fly home from a Caribbean island, the birth certificate is no longer enough. The passport book is the boring, correct choice. Non-citizens should read the cruise line’s rule for their status before they pay the deposit. Names on the ticket must match the document.",
        tips: [
          "Every sailor needs their own ID. Grandkids included.",
          "Put passports in a carry-on, not in the checked suitcase.",
          "The name on the booking has to match the name on the ID.",
        ],
        query: "Port Canaveral cruise terminal",
        site: {
          href: "https://www.cbp.gov/travel/us-citizens/western-hemisphere-travel-initiative",
          label: "U.S. cruise document rules",
        },
      },
      {
        id: "embark",
        name: "Embarkation morning",
        drive: "Your assigned arrival window",
        who: "The least romantic hour of the trip",
        image: "/graphics/cruises/embark.jpg",
        blurb:
          "Check in online weeks ahead. Arrive when they tell you. The ship does not sail earlier because you got there at dawn.",
        more: "Online check-in usually opens a few weeks before the sail. Do it. You pick an arrival time, upload documents, and add the credit card for the onboard account. On the morning, the port wants you in that window. Too early and you sit in the garage. Too late and you are the reason the pier is tense. Porters take the big bag at the curb. You carry medication, documents, a change of clothes, and anything you need before the suitcase finds the cabin, which can be evening. Eat before you arrive. The windjammer is not open at the curb. Once you are aboard, the muster drill is mandatory. Do it before you hunt for coffee.",
        tips: [
          "Assigned time. Not ‘whenever traffic allows.’",
          "Meds, documents, and one outfit stay in the bag you carry.",
          "Muster first. The lounge will still be there.",
        ],
        query: "Port Canaveral cruise parking",
      },
      {
        id: "packing",
        name: "What Villagers actually pack",
        drive: "The night before, not at the curb",
        who: "Carry-on people",
        image: "/graphics/cruises/packing.jpg",
        blurb:
          "Medicine in the original bottles, a hat, a light wrap for the dining room, and a power strip that is not a surge protector.",
        more: "Pack as if the suitcase will be late, because sometimes it is. Medications stay in their labeled bottles in the bag you carry on, with a few extra days in case the ship is held. A written list helps the ship’s doctor more than a mystery pill organizer. Most ships ban surge protectors and extension cords with a surge box. A plain power strip, if your line allows it, is the usual workaround. Confirm that on your line’s site. Formal night is softer than it used to be on many ships. A jacket and a dress you would wear to a nice Villages dinner is enough unless your line still prints the word formal in bold. Magnets are the cabin decor. The walls are metal. Swimsuits go in the carry-on if you want the pool before the bag arrives.",
        tips: [
          "No surge protector until your cruise line says yes.",
          "Extra days of medication, in the carry-on.",
          "A hat and a sweater. The dining room is cold. The pool deck is not.",
        ],
        query: "Port Canaveral cruise terminal",
      },
      {
        id: "medical",
        name: "Medicare does not board",
        drive: "Ask before the deposit",
        who: "Anyone on Medicare",
        image: "/graphics/cruises/family.jpg",
        blurb:
          "Once the ship is outside U.S. waters, Medicare usually stays home. Medical care on board and a flight home are a separate bill.",
        more: "This is the un-fun card and the one worth reading. Medicare generally does not pay for medical care outside the United States, and a Caribbean cruise spends most of its week outside the United States. The ship has a medical center. It is not free, and it is not a hospital. Evacuation from an island is a separate, large bill. Travel insurance that includes medical care and evacuation, or a policy the cruise line sells, is the conversation to have before you sail. This page is not an insurance agent. Ask yours, and read what the cruise line’s policy actually covers. Tell the line about mobility equipment when you book. Scooters are common here. Cabin doors, tenders, and shore excursions are not all the same width.",
        tips: [
          "Ask about medical coverage and evacuation, not just trip cancellation.",
          "Tell the cruise line about a scooter or wheelchair when you book the cabin.",
          "Tender ports are small boats. A scooter may not go ashore that day.",
        ],
        query: "Port Canaveral Florida",
      },
    ],
  },
  {
    id: "family",
    title: "Grandkids, and the drive home",
    image: "/graphics/cruises/family.jpg",
    lead: "The ship is a floating rec center. The parking garage is still a parking garage.",
    places: [
      {
        id: "grandkids",
        name: "Sailing with grandkids",
        drive: "Disney from Canaveral is the easy version",
        who: "Kids’ clubs and early bedtimes",
        image: "/graphics/cruises/family.jpg",
        blurb:
          "Every child needs documents. Kids’ clubs fill up. A connecting cabin beats a speech about sharing a bathroom.",
        more: "Cruising with grandchildren is a different trip from cruising with the card group. Disney ships from Port Canaveral are built for it: clubs by age, early dinners, and a ship that assumes someone will spill a juice. Other lines have kids’ clubs too, and they have age rules and registration on embarkation day. Do that early. Every child needs a document in their own name. Book a cabin arrangement you can live with. Connecting rooms exist and go first. Shore days with little children are better as a ship day or a short beach than a twelve-hour van tour. The pool deck at noon is the real excursion.",
        tips: [
          "Register for the kids’ club on boarding day, not at dinner.",
          "Pack one carried outfit and swimsuits. Bags are slow.",
          "A sea day is a successful day. You do not have to buy every tour.",
        ],
        query: "Disney Cruise Line Port Canaveral",
        site: { href: "https://www.portcanaveral.com/", label: "Port Canaveral ships" },
      },
      {
        id: "home",
        name: "Getting home in one piece",
        drive: "Morning dock, then the car",
        who: "The last hour of the cruise",
        image: "/graphics/cruises/canaveral.jpg",
        blurb:
          "You cannot get off the moment the ship touches the pier. Breakfast, customs, and a walk to the garage are the real schedule.",
        more: "Disembarkation is a line with a view. The ship will assign a time, or you can carry your own bags off in an earlier group. Either way, customs is a face and a document, and the bag you checked the night before has to be on the pier before you are. From Port Canaveral or Jacksonville, a morning off the ship can still be an afternoon in The Villages. From Tampa, give the I-75 traffic its due. From Fort Lauderdale or Miami, a same-day drive is a long one and a same-day flight is how people sleep in the terminal. If you parked in a port garage, photograph the row when you arrive. Seven days later the garage looks like every other floor.",
        tips: [
          "Photograph the parking spot on the way in.",
          "Keep one set of clothes and the documents out of the bag you put out the night before.",
          "Miami and Fort Lauderdale deserve a next-day drive or a next-day flight.",
        ],
        query: "Port Canaveral parking garage",
      },
    ],
  },
];

export function CruiseCentral() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = GROUPS.flatMap((group) => group.places).find((place) => place.id === openId) || null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <section className="section">
        <div className="shell">
          <div className="ms-boat-jump">
            <a className="btn btn-ghost btn-sm" href="#sailings">Upcoming sailings</a>
            <a className="btn btn-ghost btn-sm" href="#deals">Deals</a>
            <a className="btn btn-ghost btn-sm" href="#ships">The ships</a>
            <a className="btn btn-ghost btn-sm" href="#cruise-drive">When to leave</a>
            <a className="btn btn-ghost btn-sm" href="#cruise-compare">Which port</a>
            <a className="btn btn-ghost btn-sm" href="#cruise-pack">Packing</a>
            <a className="btn btn-ghost btn-sm" href="#cruise-group">The group</a>
            <a className="btn btn-ghost btn-sm" href="#cruise-access">Getting aboard</a>
            <a className="btn btn-ghost btn-sm" href="#cruise-weather">Storms</a>
            <a className="btn btn-ghost btn-sm" href="#cruise-photos">Photos</a>
            {GROUPS.map((group) => (
              <a key={group.id} className="btn btn-ghost btn-sm" href={`#${group.id}`}>
                {group.title}
              </a>
            ))}
          </div>
          <div className="golf-feature-grid">
            {GROUPS.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="golf-feature-card about-panel">
                <div className="golf-feature-art">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={group.image} alt="" className="golf-feature-img" />
                </div>
                <div className="golf-feature-body">
                  <strong>{group.title}</strong>
                  <span>{group.lead}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CruiseSailings />
      <CruiseHarbor />

      {GROUPS.map((group) => (
        <section key={group.id} className="section" id={group.id} style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="section-head">
              <div>
                <h2>{group.title}</h2>
                <p>{group.lead}</p>
              </div>
            </div>
            <div className="ms-boat-grid">
              {group.places.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  className="about-panel trip-card"
                  onClick={() => setOpenId(place.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={place.image} alt="" />
                  <div className="trip-card-body">
                    <p className="ms-boat-meta">{place.drive}</p>
                    <h3>{place.name}</h3>
                    <p className="ms-boat-meta">{place.who}</p>
                    <p>{place.blurb}</p>
                    <p className="trip-card-more">More about this</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ))}

      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="trip-pop-scrim" onClick={() => setOpenId(null)}>
              <div
                className="trip-pop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cruise-pop-title"
                onClick={(event) => event.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="trip-pop-art" src={open.image} alt="" />
                <div className="trip-pop-body">
                  <div className="ms-cal-pop-bar">
                    <p className="panel-hint" style={{ margin: 0 }}>
                      {open.drive}
                    </p>
                    <button type="button" className="ms-cal-pop-close" onClick={() => setOpenId(null)}>
                      Close
                    </button>
                  </div>
                  <h3 id="cruise-pop-title">{open.name}</h3>
                  <p className="ms-boat-meta">{open.who}</p>
                  <p>{open.more}</p>
                  <ul className="trip-pop-tips">
                    {open.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <div className="hero-actions">
                    <a
                      className="btn btn-primary btn-sm"
                      href={mapsSearch(open.query)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in maps
                    </a>
                    {open.site ? (
                      <a
                        className="btn btn-ghost btn-sm"
                        href={open.site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {open.site.label}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
