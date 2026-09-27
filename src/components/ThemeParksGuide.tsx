"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type Outing = {
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
  places: Outing[];
};

const GROUPS: Group[] = [
  {
    id: "disney",
    title: "Walt Disney World",
    image: "/graphics/theme-parks/castle.jpg",
    lead: "Four ticketed parks and a free downtown. One gate is a full day.",
    places: [
      {
        id: "magic",
        name: "Magic Kingdom",
        drive: "About 1 hour 30 minutes · Bay Lake",
        who: "The castle day",
        image: "/graphics/theme-parks/castle.jpg",
        blurb: "The park people mean when they say Disney. Main Street, the castle, and a lot of walking between lands.",
        more: "Magic Kingdom is the original Florida park. It is the one with the castle, the parades, and the fireworks. A Villages day trip lands you there in about an hour and a half unless I-4 is sulking, which it often is after midafternoon. The ticket is for this gate unless it says park hopper. Parking is a separate charge from the ticket, and the lot tram is part of the morning. Buy the ticket on Disney’s site or through a membership you already trust. A barcode from a stranger is how people get to the turnstile and go home.",
        tips: [
          "Be at the gate when it opens. Arriving at 11 is a different park.",
          "One park. Do not add EPCOT and a water park and call it easy.",
          "Fireworks are the reason to stay. Check the app for the night’s time.",
        ],
        query: "Magic Kingdom Walt Disney World",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney World" },
      },
      {
        id: "epcot",
        name: "EPCOT",
        drive: "About 1 hour 30 minutes",
        who: "A walk around the world",
        image: "/graphics/day-trips/disney.jpg",
        blurb: "The ball, the countries, and a festival that changes the food. Gentler than the coaster parks if the knees are the limit.",
        more: "EPCOT is the park for people who would rather walk, eat, and ride a few gentle things than chase a dozen coasters. World Showcase is a loop of countries. The front of the park is the rides and the ball. Festivals rotate through the year and they are the reason the food is interesting. It is still a full day, and it is still a separate ticket from Magic Kingdom unless the ticket says otherwise. The same I-4 warning applies on the way home.",
        tips: [
          "Eat in World Showcase. That is the point of this park.",
          "The loop is longer than it looks. Real shoes.",
          "Festival menus are on the app, and the good windows sell out.",
        ],
        query: "EPCOT Walt Disney World",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney World" },
      },
      {
        id: "hollywood",
        name: "Hollywood Studios",
        drive: "About 1 hour 30 minutes",
        who: "Star Wars, Toy Story, and a tower",
        image: "/graphics/day-trips/disney.jpg",
        blurb: "The compact Disney park. Big rides, a lot of shows, and lines that do not care that you used to be early.",
        more: "Hollywood Studios is the smaller Disney gate with the heaviest rides: Star Wars, Toy Story, and the Tower of Terror. It fills early. Disney sells a paid way to hold a ride time, and the name and the price of that product change. Read the current explanation in the My Disney Experience app the week you go, not a blog from last spring. A day here is a day. Pairing it with another park is a park-hopper ticket and a tired car ride.",
        tips: [
          "Rope drop, or accept the line.",
          "The paid ride reservation is explained in Disney’s own app.",
          "Shows are the air-conditioned break. Read the times before you walk past them.",
        ],
        query: "Disney's Hollywood Studios",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney World" },
      },
      {
        id: "animal",
        name: "Animal Kingdom",
        drive: "About 1 hour 35 minutes",
        who: "Animals, a mountain, and shade",
        image: "/graphics/day-trips/animals.jpg",
        blurb: "The zoo-and-coaster park. Go early, when the animals are awake and the paths are still shaded.",
        more: "Animal Kingdom is Disney’s animal park: trails, a safari, Pandora, and Expedition Everest. The animals are more interesting in the morning. By afternoon the Florida sun has won and a lot of creatures have gone to nap. It is outdoors. Hats, water, and a plan for the thunderstorm that builds after lunch. The park often closes earlier than Magic Kingdom. Check the day’s hours before you promise fireworks that this gate does not have.",
        tips: [
          "Morning for the animals. Afternoon is hotter and quieter.",
          "The safari is the ride to do before lunch.",
          "Hours here are often shorter. Look them up the night before.",
        ],
        query: "Disney's Animal Kingdom",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney World" },
      },
      {
        id: "springs",
        name: "Disney Springs",
        drive: "About 1 hour 25 minutes · Lake Buena Vista",
        who: "No ticket",
        image: "/graphics/day-trips/town.jpg",
        blurb: "Disney’s shopping and dining district. Free to walk into. The parking garage is the only puzzle.",
        more: "Disney Springs is not a theme park. There is no castle ticket. It is restaurants, shops, and a lake, and it is the honest answer when someone wants ‘a little Disney’ without a full park day. Parking garages are signed. Photograph the garage name and the floor, the same way you would on a ship. Dinner reservations still matter on a Saturday. It pairs with a park only if the park day ended early and the group still has patience.",
        tips: [
          "No theme-park ticket required.",
          "Remember which garage. They look alike at 9 p.m.",
          "A Saturday dinner without a reservation is a walk.",
        ],
        query: "Disney Springs Lake Buena Vista",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney World" },
      },
    ],
  },
  {
    id: "universal",
    title: "Universal Orlando",
    image: "/graphics/day-trips/universal.jpg",
    lead: "Three theme parks now, plus a water park. Epic Universe is its own gate.",
    places: [
      {
        id: "studios",
        name: "Universal Studios Florida",
        drive: "About 1 hour 25 minutes",
        who: "Movies, rides, and a lot of shade breaks",
        image: "/graphics/day-trips/universal.jpg",
        blurb: "The original Universal park. Shows and rides stacked along a working-studio street.",
        more: "Universal Studios Florida is the movie park: rides, a few shows, and lands that change when a film gets old. It sits next to Islands of Adventure. A ticket that says one park is one park. A ticket that says park-to-park is how you walk between them. CityWalk, the dining street in the middle, does not need a park ticket. Buy from Universal or a seller you already use. Height rules are on each ride’s page, and they are not suggestions.",
        tips: [
          "Check whether the ticket is one park or park-to-park.",
          "CityWalk is the free middle if someone only wants dinner.",
          "Read height rules before you promise a child a ride.",
        ],
        query: "Universal Studios Florida Orlando",
        site: { href: "https://www.universalorlando.com/", label: "Universal Orlando" },
      },
      {
        id: "islands",
        name: "Islands of Adventure",
        drive: "About 1 hour 25 minutes",
        who: "The coaster park",
        image: "/graphics/day-trips/universal.jpg",
        blurb: "Harry Potter, a spider-man ride, and the coasters. This is the one that rattles a watch.",
        more: "Islands of Adventure is Universal’s thrill park, next door to the studios. The Wizarding World is the land people cross the park to see. It is a full day if you ride the big ones, and a shorter day if the group is there for the castle and a butterbeer. Express passes are a paid skip-the-line product. The price and the rules are on Universal’s site. Hotel guests of Universal sometimes get in early. A day-tripper from The Villages usually does not.",
        tips: [
          "The castle land is busiest in the middle of the day.",
          "Early entry is for Universal hotel guests, not for the driveway in The Villages.",
          "Lockers are required on some coasters. Read the sign before you queue.",
        ],
        query: "Islands of Adventure Universal Orlando",
        site: { href: "https://www.universalorlando.com/", label: "Universal Orlando" },
      },
      {
        id: "epic",
        name: "Epic Universe",
        drive: "About 1 hour 25 minutes",
        who: "The new gate",
        image: "/graphics/theme-parks/castle.jpg",
        blurb: "Universal’s newest park, opened in 2025. Its own parking, its own ticket, not a land inside the old parks.",
        more: "Epic Universe is a separate Universal park with its own front gate and its own lot. It is not a section you wander into from Islands of Adventure. Treat it as its own day, the way you would treat Magic Kingdom as its own day. The lands are new, the operations are still settling, and the official site is where hours and tickets live. Do not buy a ticket that only says ‘Universal Orlando’ and assume this gate is on it. Read the gate names on the ticket.",
        tips: [
          "Own parking lot. Set the GPS to Epic Universe, not ‘Universal.’",
          "Read the ticket. This gate is easy to leave off by accident.",
          "One new park is enough. Do not stack it on the two older parks.",
        ],
        query: "Universal Epic Universe Orlando",
        site: { href: "https://www.universalorlando.com/", label: "Universal Orlando" },
      },
      {
        id: "citywalk",
        name: "CityWalk",
        drive: "About 1 hour 25 minutes",
        who: "Dinner without a ticket",
        image: "/graphics/day-trips/town.jpg",
        blurb: "The restaurants and the cinema between the original two parks. Free to enter. The parking still costs.",
        more: "CityWalk is Universal’s entertainment street. You can eat there without entering a park. Parking is the paid part, and after a certain hour Universal has sometimes validated it with a receipt. That policy moves. Read the current note on their site if the plan is dinner only. It is a good landing spot when the group split — some rode, some did not — and everyone still wants to sit down.",
        tips: [
          "No park ticket for the restaurants.",
          "Ask about parking validation that day. Do not assume last year’s rule.",
          "It gets loud at night. That is the product.",
        ],
        query: "Universal CityWalk Orlando",
        site: { href: "https://www.universalorlando.com/", label: "Universal Orlando" },
      },
    ],
  },
  {
    id: "seaworld",
    title: "SeaWorld, Discovery Cove, and Busch Gardens",
    image: "/graphics/theme-parks/lagoon.jpg",
    lead: "Animals and coasters. Mornings are when the animals are doing anything.",
    places: [
      {
        id: "seaworld",
        name: "SeaWorld Orlando",
        drive: "About 1 hour 20 minutes · International Drive",
        who: "Animals and a few serious coasters",
        image: "/graphics/theme-parks/lagoon.jpg",
        blurb: "Dolphin and orca habitats, shows, and roller coasters on the same property. Hats. It is outdoors.",
        more: "SeaWorld Orlando mixes animal habitats with rides that are genuinely thrilling. The shows and the habitats are the morning. The coasters are whenever the line looks kind. It is all outside. A thunderstorm will pause the rides, the same as every other Florida park. Aquatica, the water park, is the sister gate next door and is its own ticket unless the bundle says otherwise. Discovery Cove is the third sister, and it is a reservation, not a walk-up.",
        tips: [
          "Morning for the animals and the shows.",
          "Aquatica is next door and usually a separate ticket.",
          "Read what the day’s ticket includes. Bundles change.",
        ],
        query: "SeaWorld Orlando",
        site: { href: "https://seaworld.com/orlando/", label: "SeaWorld Orlando" },
      },
      {
        id: "discovery",
        name: "Discovery Cove",
        drive: "About 1 hour 20 minutes",
        who: "A reserved, all-day animal park",
        image: "/graphics/theme-parks/lagoon.jpg",
        blurb: "Not a walk-up afternoon. You reserve the day. The number of guests is limited. Read what that date includes.",
        more: "Discovery Cove is the quiet, expensive sister of SeaWorld. You book a day, you arrive at your time, and the park is not trying to hold forty thousand people. What is included — the dolphin experience, the snacks, a day at SeaWorld or Aquatica — is whatever that season’s package says. Read the package before you promise the grandkids a swim with a dolphin. Some days and some ages are different. This is a resort day, not a ‘we were in the neighborhood’ stop.",
        tips: [
          "Reserve ahead. The gate is not built for impulse.",
          "Read the package. Included parks and animal swims vary.",
          "It is a whole day. Do not book a 7 p.m. dinner in The Villages.",
        ],
        query: "Discovery Cove Orlando",
        site: { href: "https://discoverycove.com/", label: "Discovery Cove" },
      },
      {
        id: "busch",
        name: "Busch Gardens Tampa",
        drive: "About 1 hour 50 minutes · Tampa",
        who: "Coasters and animals",
        image: "/graphics/day-trips/animals.jpg",
        blurb: "The Tampa park. Serengeti animals in the morning, coasters when you are ready, I-75 on the way home.",
        more: "Busch Gardens Tampa Bay is a full theme park with a serious animal collection and a serious coaster lineup. It is about an hour and fifty minutes down I-75, longer on a Friday afternoon. Go early for the animals, the same as Animal Kingdom. Adventure Island, the water park, is next door and is its own day unless the ticket explicitly includes it. One Tampa park plus the drive is plenty. Do not add a beach.",
        tips: [
          "Leave earlier than the map on a Friday.",
          "Animals first, coasters after.",
          "Adventure Island is the water park next door, on its own ticket unless the bundle says so.",
        ],
        query: "Busch Gardens Tampa Bay",
        site: { href: "https://buschgardens.com/tampa/", label: "Busch Gardens" },
      },
    ],
  },
  {
    id: "smaller",
    title: "Smaller parks",
    image: "/graphics/day-trips/legoland.jpg",
    lead: "The gates that do not need a strategy meeting.",
    places: [
      {
        id: "legoland",
        name: "LEGOLAND Florida",
        drive: "About 1 hour 15 minutes · Winter Haven",
        who: "Grandkids who still build",
        image: "/graphics/day-trips/legoland.jpg",
        blurb: "A Lego park built for children, not for coaster bragging. Winter Haven is the closest ‘real’ theme park to town.",
        more: "LEGOLAND Florida is the theme park for younger grandkids: builds, gentle rides, a driving school, and Miniland. It is about an hour and fifteen minutes, closer than Disney. The water park on the property is a separate thought — see the water section. Peppa Pig Theme Park sits on the same resort and is aimed even younger. Read which gate the ticket opens. A day at LEGOLAND is a kinder day than Hollywood Studios, and that is the recommendation.",
        tips: [
          "Best when the children still think a Duplo is a thrill.",
          "Confirm whether Peppa Pig and the water park are on the ticket.",
          "Closer than Disney. Still a full day.",
        ],
        query: "LEGOLAND Florida Winter Haven",
        site: { href: "https://www.legoland.com/florida/", label: "LEGOLAND Florida" },
      },
      {
        id: "peppa",
        name: "Peppa Pig Theme Park",
        drive: "About 1 hour 15 minutes · Winter Haven",
        who: "The little ones",
        image: "/graphics/day-trips/legoland.jpg",
        blurb: "A small park for preschoolers, next to LEGOLAND. Perfect at that age. Too small if the kids have outgrown it.",
        more: "Peppa Pig Theme Park Florida is a compact, preschool-sized park on the LEGOLAND resort. The rides are gentle and the day is shorter than a Disney day, which is the gift. If the children are in grade school and want coasters, this is the wrong gate and LEGOLAND or Fun Spot is the right one. Tickets and whether it is bundled with LEGOLAND are on their site.",
        tips: [
          "Preschool scale. Look at the child’s age before you sell the day.",
          "It can share a day with LEGOLAND only if the ticket and the stamina agree.",
          "Morning is enough. You can be home for a late lunch if you go early.",
        ],
        query: "Peppa Pig Theme Park Florida Winter Haven",
        site: { href: "https://www.legoland.com/florida/", label: "LEGOLAND resort" },
      },
      {
        id: "funspot",
        name: "Fun Spot America",
        drive: "About 1 hour 20 minutes · Kissimmee or Orlando",
        who: "Go-karts and a coaster without a full-park price",
        image: "/graphics/day-trips/universal.jpg",
        blurb: "Two parks, one in Kissimmee and one in Orlando. Go-karts, a few rides, and an arcade. Pay for what you ride.",
        more: "Fun Spot is the old-fashioned amusement park that survived next door to Disney and Universal. There is a Kissimmee location and an Orlando location. You can often pay by the ride or buy an armband. That is the appeal when nobody wants a $200 day. The coasters are real enough. The go-karts are the reason a lot of Villages grandkids remember it. Check which address you put in the GPS. They are not the same parking lot.",
        tips: [
          "Pick Kissimmee or Orlando on purpose.",
          "An armband and a ride-by-ride ticket are different deals. Read both.",
          "A half day works here better than it works at Disney.",
        ],
        query: "Fun Spot America Kissimmee",
        site: { href: "https://fun-spot.com/", label: "Fun Spot" },
      },
      {
        id: "icon",
        name: "ICON Park",
        drive: "About 1 hour 25 minutes · International Drive",
        who: "The wheel, the aquarium, a wax museum",
        image: "/graphics/day-trips/disney.jpg",
        blurb: "An entertainment complex, not one gate. You buy the wheel, SEA LIFE, or Madame Tussauds separately.",
        more: "ICON Park is the International Drive complex with The Wheel, SEA LIFE Orlando, Madame Tussauds, and a street of restaurants. Each attraction has its own ticket. You can walk the complex and eat without buying any of them. It is the flexible afternoon when a full theme park is too much and Disney Springs is too far the other way. The Wheel is high. If someone does not like heights, the aquarium is the kinder ticket.",
        tips: [
          "Each attraction is its own ticket.",
          "You can just eat. The sidewalk is free.",
          "The Wheel is a height. Ask before you buy four tickets.",
        ],
        query: "ICON Park Orlando",
        site: { href: "https://iconparkorlando.com/", label: "ICON Park" },
      },
      {
        id: "oldtown",
        name: "Old Town Kissimmee",
        drive: "About 1 hour 20 minutes",
        who: "A Saturday night cruise",
        image: "/graphics/day-trips/town.jpg",
        blurb: "A souvenir street and a classic-car cruise. Free to walk. The shows and the rides cost extra.",
        more: "Old Town is a Kissimmee pedestrian street: shops, small rides, and weekend car shows that are the actual event. You do not need a strategy. You park, you walk, you buy a lemonade, and you leave when the group has seen the cars. It is a pleasant add-on only if you are already on that side of Kissimmee. It is not a substitute for a theme park, and it does not pretend to be.",
        tips: [
          "Check which night the car cruise is, if that is why you are going.",
          "Walking in is free. Rides are not.",
          "Pair it with Fun Spot, not with a full Disney day.",
        ],
        query: "Old Town Kissimmee",
        site: { href: "https://www.myoldtownusa.com/", label: "Old Town" },
      },
      {
        id: "wonderworks",
        name: "WonderWorks",
        drive: "About 1 hour 25 minutes · International Drive",
        who: "An upside-down building on a rainy afternoon",
        image: "/graphics/day-trips/universal.jpg",
        blurb: "An indoor science-play museum in an upside-down house. The honest rainy-day backup.",
        more: "WonderWorks is the upside-down building on International Drive. Inside it is a hands-on museum: ropes, illusions, a little laser tag. It will not replace a theme park. It will save a day when the sky opens and the water park closes the slides. There is another location in Pigeon Forge, which is not this one. Use the Orlando address.",
        tips: [
          "Indoor. That is the feature.",
          "Orlando, not Tennessee.",
          "A two-hour visit, not a sunrise-to-fireworks day.",
        ],
        query: "WonderWorks Orlando International Drive",
        site: { href: "https://www.wonderworksonline.com/orlando/", label: "WonderWorks" },
      },
    ],
  },
  {
    id: "water",
    title: "Water parks",
    image: "/graphics/theme-parks/water.jpg",
    lead: "Slides close when the thunder starts. Have dry clothes in the car.",
    places: [
      {
        id: "blizzard",
        name: "Blizzard Beach",
        drive: "About 1 hour 30 minutes · Disney",
        who: "Disney’s ski-resort water park",
        image: "/graphics/theme-parks/water.jpg",
        blurb: "The Disney water park that was open while Typhoon Lagoon went down for work in September 2026. Check which one is open the week you go.",
        more: "Disney runs two water parks and, as a habit, keeps at least one of them open while the other is in rehab or closed for weather. In September 2026 Typhoon Lagoon closed for refurbishment and Disney pointed guests to Blizzard Beach. That swap happens. Look at Disney’s water-park calendar a day or two before you drive, not the month before. A water-park ticket is not a Magic Kingdom ticket. Summit Plummet is a very tall slide. The lazy river is the other half of the park, and it is the one grandparents actually finish.",
        tips: [
          "Check which Disney water park is open that day.",
          "The ticket is for the water park, not the castle.",
          "Thunder closes the slides. The parking lot becomes the plan B.",
        ],
        query: "Disney's Blizzard Beach",
        site: { href: "https://disneyworld.disney.go.com/destinations/blizzard-beach/", label: "Blizzard Beach" },
      },
      {
        id: "typhoon",
        name: "Typhoon Lagoon",
        drive: "About 1 hour 30 minutes · Disney",
        who: "The wave pool, when it is open",
        image: "/graphics/theme-parks/water.jpg",
        blurb: "Disney’s tropical water park, with the big wave pool. Closed for refurbishment starting September 9, 2026. Re-check before you promise it.",
        more: "Typhoon Lagoon is the Disney water park with the surf pool and Castaway Creek, the lazy river. Disney’s own pages said it would be temporarily closed for refurbishment beginning September 9, 2026, and sent guests to Blizzard Beach in the meantime. Water parks at Disney also close for weather with little notice. If the calendar says closed, it is closed. Do not drive down to negotiate with the parking attendant. When it is open, it is its own day, and the wave pool is the reason to pick it over a slide park.",
        tips: [
          "Confirm it has reopened. A refurbishment is not a suggestion.",
          "The wave pool is the famous part.",
          "Disney’s calendar is the source. A blog recap is not.",
        ],
        query: "Disney's Typhoon Lagoon",
        site: { href: "https://disneyworld.disney.go.com/destinations/typhoon-lagoon/", label: "Typhoon Lagoon" },
      },
      {
        id: "volcano",
        name: "Volcano Bay",
        drive: "About 1 hour 25 minutes · Universal",
        who: "Universal’s water park",
        image: "/graphics/theme-parks/water.jpg",
        blurb: "A Universal water park with a tap-on wristband that holds your place in a slide line. Still a full day.",
        more: "Volcano Bay is Universal’s polished water park. The wristband system lets you hold a return time for a slide instead of standing on hot concrete the whole time. It is clever, and it is still a water park in Florida heat. Go at opening, ride the thing you came for, and get off the pavement when the sky goes dark. It is not included just because you bought an Epic Universe ticket. Read the ticket.",
        tips: [
          "The wristband is the line. Learn it at the gate, not on the third slide.",
          "Opening time matters more than it does at a lazy river.",
          "Separate from the theme-park ticket unless the bundle says otherwise.",
        ],
        query: "Universal Volcano Bay",
        site: { href: "https://www.universalorlando.com/", label: "Universal Orlando" },
      },
      {
        id: "aquatica",
        name: "Aquatica",
        drive: "About 1 hour 20 minutes · SeaWorld",
        who: "Slides next to SeaWorld",
        image: "/graphics/theme-parks/lagoon.jpg",
        blurb: "SeaWorld’s water park. Dolphin views on one slide, a lazy river, and a ticket that may or may not include the theme park.",
        more: "Aquatica Orlando sits beside SeaWorld. Some visits bundle the two and some do not. The slide that passes by the dolphin habitat is the one people talk about. Everything else is a proper water park: waves, a river, and food that costs theme-park money. Same thunder rule as the others. Dry clothes and a towel in the car, because the park will not keep you for the lightning.",
        tips: [
          "Ask if today includes SeaWorld or only the water.",
          "Reef slide first, if that is the one you wanted.",
          "Sunscreen before you leave the house. The line to buy it is silly.",
        ],
        query: "Aquatica Orlando",
        site: { href: "https://aquatica.com/orlando/", label: "Aquatica" },
      },
      {
        id: "adventure",
        name: "Adventure Island",
        drive: "About 1 hour 50 minutes · Tampa",
        who: "The water park next to Busch Gardens",
        image: "/graphics/theme-parks/water.jpg",
        blurb: "Busch Gardens’ water park. A Tampa day, not an add-on after the coasters.",
        more: "Adventure Island is the water park beside Busch Gardens Tampa. The drive is the same hour-and-fifty-minutes, and doing both in one day is how everyone gets sunburned and cranky on I-75. Pick the animals and coasters, or pick the water. The ticket page will tell you if a bundle exists that week. It does not change the heat.",
        tips: [
          "One Tampa park. Water or Busch Gardens.",
          "Friday I-75 is longer than the map.",
          "Leave when you hear thunder. The highway will still be there.",
        ],
        query: "Adventure Island Tampa water park",
        site: { href: "https://adventureisland.com/", label: "Adventure Island" },
      },
      {
        id: "lego-water",
        name: "LEGOLAND Water Park",
        drive: "About 1 hour 15 minutes · Winter Haven",
        who: "Small slides for small kids",
        image: "/graphics/day-trips/legoland.jpg",
        blurb: "The water park on the LEGOLAND resort. Built for children. A gentle companion to the theme park, not a second Disney.",
        more: "LEGOLAND’s water park is sized for the same kids as the theme park. It is not Volcano Bay and it is not trying to be. If the ticket includes it, a morning in the theme park and a short splash after lunch can work, because you are already in Winter Haven. If the children are teenagers, take them to a bigger water park and skip the argument. Hours and whether it is open in the cooler months are on LEGOLAND’s site.",
        tips: [
          "Confirm it is on the ticket and open that day.",
          "Right size for younger kids.",
          "You are already there if you did LEGOLAND in the morning.",
        ],
        query: "LEGOLAND Florida Water Park",
        site: { href: "https://www.legoland.com/florida/", label: "LEGOLAND Florida" },
      },
      {
        id: "islandh2o",
        name: "Island H2O",
        drive: "About 1 hour 25 minutes · Kissimmee",
        who: "A water park that is not Disney",
        image: "/graphics/theme-parks/water.jpg",
        blurb: "A Kissimmee water park with slides and a wave pool. Often the simpler ticket when Disney’s water parks are in rehab.",
        more: "Island H2O Live is a standalone water park in Kissimmee, useful when you want slides without a Disney or Universal reservation system. It is about an hour and twenty-five minutes. The same heat and lightning rules apply. It will not have a castle at the end of the day. It will have a lazy river and a parking lot you can find again. Check the day’s hours. Water parks shorten them when the season cools.",
        tips: [
          "A straightforward water-park day.",
          "Look at the hours. Off-season days end early.",
          "Kissimmee traffic near sunset is the drive to respect.",
        ],
        query: "Island H2O Water Park Kissimmee",
        site: { href: "https://islandh2olive.com/", label: "Island H2O" },
      },
      {
        id: "daytona-lagoon",
        name: "Daytona Lagoon",
        drive: "About 1 hour 30 minutes · Daytona Beach",
        who: "Water plus a beach town",
        image: "/graphics/day-trips/beach.jpg",
        blurb: "A smaller water park at Daytona. Combine it with the beach, or it is a modest slide park for the drive.",
        more: "Daytona Lagoon is a local water park, go-karts, and an arcade sitting in Daytona Beach. It is not in the same league as Volcano Bay, and the drive only makes sense if the beach was already the plan. Do the slides in the morning, eat, and give the Atlantic an hour. Two big activities and the drive home is the whole day. Daytona Lagoon’s site has the current rides and hours.",
        tips: [
          "Pair it with the beach, not with Disney.",
          "Smaller park. Set the expectation in the car.",
          "Morning slides, afternoon sand, home before the storms stack up.",
        ],
        query: "Daytona Lagoon",
        site: { href: "https://daytonalagoon.com/", label: "Daytona Lagoon" },
      },
    ],
  },
  {
    id: "park-plan",
    title: "Before you roll",
    image: "/graphics/theme-parks/mascot.jpg",
    lead: "The part that keeps a good park from becoming a bad story.",
    places: [
      {
        id: "tickets",
        name: "Tickets and parking",
        drive: "Buy before you merge onto I-4",
        who: "Everybody",
        image: "/graphics/theme-parks/castle.jpg",
        blurb: "Official site, AAA, or a warehouse club you already belong to. Parking is usually extra. Screenshot the ticket.",
        more: "Buy the ticket from the park or from AAA, Costco, or Sam’s if you already have the membership and the price is real. Florida resident discounts show up on the official sites several times a year. A coupon blog is not the park. Parking at the big theme parks is a separate charge. Disney has listed water-park parking as complimentary on its own water-park ticket pages, and that too can change, so read the day’s note. Put the ticket on the phone and take a screenshot. Gates do not care that the app will not load.",
        tips: [
          "Read the gate names on the ticket. Epic Universe and a water park are easy to assume.",
          "Park hopper means two parks. It does not manufacture energy.",
          "Screenshot the barcode.",
        ],
        query: "Walt Disney World tickets",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney tickets" },
      },
      {
        id: "day",
        name: "A Villages park day",
        drive: "Out early, home before the worst of I-4",
        who: "The driver",
        image: "/graphics/theme-parks/mascot.jpg",
        blurb: "Leave after breakfast, not at noon. One park. The drive home is part of the trip.",
        more: "From the middle of The Villages, the Orlando parks are roughly an hour and twenty to an hour and forty-five. Busch Gardens is closer to two. Those times assume you are not in the I-4 parking lot that forms after 3. Leave in the morning. Rope drop is when the park feels generous. Pick one gate. A water park is its own day. Pack ponchos, a charger, comfortable shoes, and a refillable bottle where the park allows it. The golf cart stays home. There is no cart path at Magic Kingdom.",
        tips: [
          "One park.",
          "Morning out, and do not invent a 7 p.m. reservation back in The Villages.",
          "I-4 after midafternoon is the tax on sleeping in.",
        ],
        query: "driving directions Magic Kingdom from The Villages Florida",
      },
      {
        id: "storms",
        name: "Lightning, scooters, and height",
        drive: "Read it before you promise a ride",
        who: "Grandkids and anyone with a knee",
        image: "/graphics/theme-parks/water.jpg",
        blurb: "Slides and coasters stop for thunder. Height rules are posted. Scooter rental is a real plan, not a failure.",
        more: "Florida afternoons build thunderstorms. Outdoor rides and every water slide close when lightning is close, sometimes for a long time. Have a show, a store, or the car as the backup. Height requirements are on the ride page and at the entrance. They do not bend for a birthday. Rider switch, where a park offers it, lets two adults ride without leaving a small child alone. Scooters and wheelchairs can be rented at the big parks. The disability pass each company offers has changed more than once. Read the current policy on that park’s site. Do not arrive expecting last year’s rule to be waiting at guest services.",
        tips: [
          "Thunder means the slides stop. Pack the dry clothes.",
          "Look up height before you drive, if a child is close to the line.",
          "The scooter is a tool. Rent it at the park or a shop the park lists.",
        ],
        query: "Walt Disney World accessibility",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney World" },
      },
    ],
  },
];

export function ThemeParksGuide() {
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
                    <p className="trip-card-more">More about this park</p>
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
                aria-labelledby="park-pop-title"
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
                  <h3 id="park-pop-title">{open.name}</h3>
                  <p className="ms-boat-meta">{open.who}</p>
                  <p>{open.more}</p>
                  <ul className="trip-pop-tips">
                    {open.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <div className="hero-actions">
                    <a className="btn btn-primary btn-sm" href={mapsSearch(open.query)} target="_blank" rel="noopener noreferrer">
                      Open in maps
                    </a>
                    {open.site ? (
                      <a className="btn btn-ghost btn-sm" href={open.site.href} target="_blank" rel="noopener noreferrer">
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
