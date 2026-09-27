"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Game = {
  id: string;
  name: string;
  players: string;
  blurb: string;
  more: string;
  tips: string[];
  image: string;
};

type Group = {
  id: string;
  title: string;
  lead: string;
  image: string;
  games: Game[];
};

const GROUPS: Group[] = [
  {
    id: "cards",
    title: "Cards and tiles",
    lead: "The tables that fill before you sit down.",
    image: "/graphics/clubs/mah-jongg.jpg",
    games: [
      {
        id: "mahjongg",
        name: "Mah Jongg",
        players: "4 players · the National Mah Jongg League card",
        image: "/graphics/clubs/mah-jongg.jpg",
        blurb: "American mah jongg. You build the hand printed on this year’s card. The card changes every April.",
        more: "Most Villages groups play American mah jongg, not the Chinese version. Four people sit at a square table. The set has 152 tiles: suits of bams, cracks, and dots, winds and dragons, flowers, and eight jokers. Everybody starts with 13 tiles, except East, who starts with 14. Before play there is a Charleston: players pass tiles to the right, across, and left so the hand can match a line on the card. On your turn you draw a tile and, if you do not win, discard one. You may call a discard only for an exposure the card allows, usually a pung (three), kong (four), or quint (five), and a call can make you expose those tiles. You win by completing one exact hand on the card and declaring Mah Jongg. The card lists the point value. Jokers can stand in for tiles in an exposure, and someone can swap a real tile for your joker when the rules allow. Buy the current National Mah Jongg League card. Last year’s card is a coaster.",
        tips: [
          "The league card is the rulebook for the year. Ask which card the table is using.",
          "East deals and pays or collects double in many groups. Confirm that before the first hand.",
          "Do not rearrange someone else’s exposures. They are part of the hand.",
        ],
      },
      {
        id: "bridge",
        name: "Bridge",
        players: "4 players · two pairs",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Partnership trick-taking. You bid for a contract, then try to take that many tricks.",
        more: "Bridge uses a 52-card deck. Partners sit across from each other. Deal 13 cards each. The auction starts with the dealer. A bid names a number of tricks above six and a trump suit, or notrump. The highest bid becomes the contract. The player who first named that suit for the winning side is declarer. Declarer’s partner lays their hand down as dummy and says nothing else that hand. Play goes clockwise. You must follow suit if you can. The highest card of the suit led wins, unless someone trumps. A contract of four hearts means you need 10 tricks. Making the contract scores below the line toward game (100 points). Overtricks, slams, and penalties score above the line. Rubber bridge ends when one side wins two games. Duplicate, which many clubs play, scores each hand against other tables that played the same cards, so you are not punished for a lucky deal at the next table. Bidding systems (Standard American, Two over One) are agreements. Ask what the pair is playing.",
        tips: [
          "Dummy does not touch the cards or suggest a play.",
          "Duplicate is a different score than living-room rubber. Ask which one tonight is.",
          "A new pair should say their bidding agreements out loud before the first hand.",
        ],
      },
      {
        id: "canasta",
        name: "Canasta and Hand and Foot",
        players: "4 players · partners",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Meld sets, build canastas of seven, and do not get stuck with a fistful of points.",
        more: "Classic canasta uses two decks plus four jokers, 108 cards, four players in pairs. Each player gets 11 or 13 cards depending on the house, and a draw pile starts with the rest. A turn is draw one, or take the whole discard pile when the rules let you, then meld or add to melds, then discard. A meld is three or more of the same rank. A canasta is seven of a kind. Red threes are bonus cards. You go out by melding or adding your last card after your side has a canasta. Cards left in your hand count against you. Hand and Foot is the larger cousin: each player has a hand and a foot, five or more canastas are required in many tables, and you cannot look at the foot until the hand is gone. Wild cards and black threes are where tables disagree. Ask for the card of house rules before you pick up the foot.",
        tips: [
          "Ask how many cards are dealt and how many canastas you need to go out.",
          "Red threes are usually laid down as soon as you get them.",
          "Going out without asking your partner is how friendships end. Many tables require you to ask.",
        ],
      },
      {
        id: "euchre",
        name: "Euchre",
        players: "4 players · partners",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "A short deck, one trump, and five tricks. The right bower is the boss.",
        more: "Euchre uses 24 cards, nine through ace, or sometimes 32. Four players, partners across. Deal five cards each and turn one card up. That suit is the offered trump. Starting on the dealer’s left, each player may order the dealer to pick it up or pass. If everyone passes, you may name a different trump. The team that chooses trump must take at least three of the five tricks. Taking all five is a march. Missing is a euchre, and the other side scores two. In trump, the jack of trump is the right bower, the highest card. The jack of the same color is the left bower, the second highest, and it counts as trump. Everyone else follows suit. First to 10 points usually wins. A loner is when one player sends their partner out and plays alone for a bigger score.",
        tips: [
          "Confirm 24-card or 32-card before the deal.",
          "Left bower is trump even though it does not look like the trump suit.",
          "Going alone is optional. It is not required just because you have both bowers.",
        ],
      },
      {
        id: "pinochle",
        name: "Pinochle",
        players: "4 players · partners, or 3",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "A double deck of nines through aces. Meld first, then take tricks, and you need both.",
        more: "Partnership pinochle uses a 48-card deck, two copies of nine through ace in each suit. Deal 12 cards each. Bid for the right to name trump. After the bid, players lay down melds: runs, marriages (king and queen of trump score more), pinochle (jack of diamonds and queen of spades), and sets of aces, kings, queens, or jacks. Then the cards go back to your hand and you play tricks. You must follow suit, and in many tables you must try to win the trick if you can. Meld points and trick points both count. A bid you do not make costs you the bid. Three-handed pinochle is a different deal. Ask which one the table is.",
        tips: [
          "Meld is scored before the cards are played. Do not scoop them early.",
          "A marriage in trump is worth more than a marriage in a side suit.",
          "Say whether you are playing must-follow and must-trump.",
        ],
      },
      {
        id: "hearts",
        name: "Hearts",
        players: "4 players",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Avoid hearts, and avoid the queen of spades. Or take them all.",
        more: "Hearts is four players, 52 cards, 13 each. Pass three cards before the hand, rotating the direction each deal, with one hand often a keeper. The player with the two of clubs leads it. You must follow suit. Highest card of the led suit takes the trick. There is no trump. Each heart taken scores 1 point. The queen of spades scores 13. Lowest score at the end wins. If you take every heart and the queen, that is shooting the moon: you score zero and everyone else scores 26, or in some houses you subtract 26 from yourself. First to 100 loses, or you play a set number of hands. You cannot lead hearts until they have been broken, unless you have nothing else.",
        tips: [
          "Pass the queen of spades only if you are sure. It comes back angry.",
          "Ask if shooting the moon is allowed. It usually is.",
          "Count the hearts as they fall. The last two tricks are where the queen hides.",
        ],
      },
      {
        id: "spades",
        name: "Spades",
        players: "4 players · partners",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Bid how many tricks you will take. Spades are always trump. Bags will get you.",
        more: "Spades is four players, partners, 13 cards each. Each player bids a number of tricks. You and your partner’s bids add up to the team bid. Spades are trump and cannot be led until they are broken, unless you have only spades. You must follow suit. Taking exactly your bid scores 10 points times the bid. Each extra trick is a bag, usually 1 point, and every 10 bags costs 100 points. Missing the bid costs 10 times the bid. Nil is a bid of zero tricks. Making nil is a big bonus. Getting set on nil is a big loss. Play to 500, or whatever the table wrote on the napkin.",
        tips: [
          "Bid your own hand. Do not bid your partner’s hopes.",
          "A bag feels free until the tenth one.",
          "Ask if nil and blind nil are in tonight’s game.",
        ],
      },
      {
        id: "gin",
        name: "Gin rummy",
        players: "2 players",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Two people, ten cards, and a race to knock before the other hand gets pretty.",
        more: "Gin rummy is two players and a 52-card deck. Deal 10 cards each. Non-dealer draws first from the stock or takes the upcard, then discards. You want runs of three or more in a suit, and sets of three or four of a rank. You may knock when the deadwood, the cards that do not fit a meld, totals 10 or less. Your opponent can then lay off cards onto your melds. If they have the same or less deadwood, they undercut you and score a bonus. Gin is knocking with zero deadwood and is worth a bigger bonus. A box is one hand. Many tables play to 100 points. Oklahoma gin changes the knock number to the rank of the upcard. Ask.",
        tips: [
          "Standard knock is 10 points. Confirm it.",
          "You cannot lay off if you did not knock, until they do.",
          "Face cards are 10. Aces are 1.",
        ],
      },
      {
        id: "poker",
        name: "Poker",
        players: "Home game · usually Texas Hold’em",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "A friendly chip game. The Villages version is nickels and bragging, not a casino.",
        more: "The home game most groups mean is Texas Hold’em. Each player gets two hole cards. Five community cards come out in a flop of three, a turn, and a river, with a round of betting before and after each. You make the best five-card hand from your two cards and the five on the board. Hand ranks, low to high: high card, pair, two pair, three of a kind, straight, flush, full house, four of a kind, straight flush. A flush beats a straight. Aces can be high or low in a straight, not both in the same straight. Blinds rotate so someone starts the pot. Agree on the chip values and the maximum raise before the first deal. This is a kitchen-table game. It is not instructions for a card room.",
        tips: [
          "Say the stakes out loud, including whether anyone can lose more than they brought.",
          "Show the winning hand. Do not scoop and narrate.",
          "A straight does not beat a flush. This argument is older than The Villages.",
        ],
      },
      {
        id: "cribbage",
        name: "Cribbage",
        players: "2 players, sometimes 3 or 4",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Peg on a board. Fifteen-two, pairs, and a run, then count the hand again.",
        more: "Two-player cribbage deals six cards each. Each player puts two cards face down into the crib, which belongs to the dealer. Cut the deck. The cut card is the starter. Then you play cards alternately, counting a running total that cannot pass 31. Peg 2 for hitting 15 or 31, 2 for a pair, 6 for three of a kind, 12 for four, and points for a run. The last card of a run to 31 is a go, worth 1. After the play, each hand is counted, non-dealer first, then dealer, then the crib. Fifteens are 2. Pairs are 2. Runs score their length. A flush in your hand scores, and the starter can join it. The crib needs all five cards the same suit for a flush. First to 121 pegs wins. You have to peg past, not land and wait, unless the table says otherwise. If you do not have a board, a piece of paper works and feels wrong.",
        tips: [
          "Count the opponent’s hand out loud. Quiet counting starts arguments.",
          "The crib is the dealer’s. Do not throw them fives if you can help it.",
          "Skunk rules, if you use them, should be said before the first deal.",
        ],
      },
      {
        id: "phase10",
        name: "Phase 10",
        players: "2 to 6",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Ten phases. You cannot skip one. Lowest score when someone finishes phase 10 wins.",
        more: "Phase 10 is a commercial rummy. Each player has a phase, from 1 to 10: sets, runs, then combinations, then longer ones. On a turn you draw, and if you have completed your current phase you may lay it down, then hit on existing lays, then discard. You only advance if you laid your phase this hand. Cards left in your hand score against you. Skip cards make the next player lose a turn. Wilds stand in. When a player completes phase 10 and goes out, the game ends and the lowest score wins. You may not lay the next phase early.",
        tips: [
          "Read the phase card. They are numbered for a reason.",
          "A skip card is rude and legal.",
          "Do not throw the card the person across from you is collecting. They can see you.",
        ],
      },
      {
        id: "skipbo",
        name: "Skip-Bo",
        players: "2 to 6",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Build piles from 1 to 12. Your stock pile is the one that has to disappear.",
        more: "Each player has a stock pile. The top card is face up. You also have a hand. The center has building piles that must start at 1 and run to 12, then clear. Skip-Bo cards are wild. On your turn you draw up to five cards and play as many as you can onto the building piles or onto your own discard piles. You may play the top of your stock pile whenever it fits. First person to empty their stock pile wins the hand. Many groups play to a set number of hands or to a score where leftover stock cards count against you.",
        tips: [
          "The stock pile is the only pile that matters at the end.",
          "A wild on top of your stock is a gift. Play it.",
          "Agree whether you are playing to one win or to a score.",
        ],
      },
      {
        id: "wizard",
        name: "Wizard",
        players: "3 to 6",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Bid the exact number of tricks. A wizard always wins. A jester always loses.",
        more: "Wizard uses a 60-card deck: a standard deck plus 4 wizards and 4 jesters. Deal increases each hand, from 1 card up to as many as the deck allows, then sometimes back down. Each hand you bid how many tricks you will take. You score 20 plus 10 per trick if you hit the bid, and you lose 10 per trick you missed. A wizard beats everything. A jester loses to everything and is often led when you want to dump a trick. Trump is set by the card turned up after the deal, unless that card is a wizard, which means no trump, or a jester, which lets the dealer name trump. Exact rules for a led wizard are on the card that came in the box. Keep that card in the box.",
        tips: [
          "Bid what you can take, not what would be fun.",
          "The score for a miss hurts more than a small bid.",
          "Keep the instruction card. The wizard-led argument is in there.",
        ],
      },
      {
        id: "bunco",
        name: "Bunco",
        players: "12 players is the classic · groups of 4",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Dice, moving tables, and almost no skill. That is the point.",
        more: "Bunco is a social dice game. Twelve people is traditional: three tables of four, partners across. You roll three dice, trying to match the round number. Round 1 wants ones, round 2 wants twos, and so on through six. Each matching die is a point. Three of a kind of the round number is a bunco, 21 points, and usually ends the turn with a bell. Three of a kind of another number is a mini bunco, often 5 points. Partners add their points. When the head table reaches 21, they ring the bell and everyone else stops. Winners move up, losers stay or move down, and partners change. You play six rounds. Prizes are for the most buncos, most wins, and most losses. The most losses is a trophy people want.",
        tips: [
          "The head table’s bell stops the room. Keep rolling until you hear it.",
          "Partners change every round. Learn the name.",
          "It is loud on purpose.",
        ],
      },
      {
        id: "bingo",
        name: "Bingo",
        players: "A whole room",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "A card, a dabber, and one number you needed two calls ago.",
        more: "Each player has one or more cards with a 5 by 5 grid. The center is often free. A caller draws numbers, B-1 through B-15, I-16 through I-30, N-31 through N-45, G-46 through G-60, O-61 through O-75. You mark a square when your card has that number. A standard win is a line across, down, or diagonal. Special games ask for a postage stamp, a picture frame, or a coverall. Shout bingo and stop. Someone will read your card back. If you marked a number that was not called, it does not count. Play as many cards as you can see at once. Four is plenty. Eight is how you miss the free space.",
        tips: [
          "Ask what pattern wins this game. It is not always a line.",
          "Keep the dabber off your slacks.",
          "Do not clear the card until the caller says the bingo is good.",
        ],
      },
      {
        id: "mexican",
        name: "Mexican Train",
        players: "2 to 8 · double-12 or double-9 dominoes",
        image: "/graphics/clubs/mah-jongg.jpg",
        blurb: "Everyone builds their own train. The Mexican train is the one anybody can play on.",
        more: "Mexican Train is a domino game. Double-12 is the usual set for a full table. The highest double starts in the center, or you work down from double-12 one round at a time. Each player builds a personal train off the center. You may also start one public Mexican train that anyone can play on. On your turn you play one domino that matches the open end of your train, or of the Mexican train, or of someone else’s train if they are marked with a penny because they could not play. If you cannot play, draw one. If you still cannot, mark your train. Doubles are followed by another play in many rule sets, and a satisfied double is one someone played off of. First to empty their hand ends the round. Everyone else scores the pips left in their hand. Lowest total after all the doubles wins. The arguments are about whether a double must be satisfied and whether you can play on a marked train. Settle them before round one.",
        tips: [
          "A penny on a train means it is public until that player plays again.",
          "Ask if doubles must be satisfied.",
          "Count pips at the end with the tiles face up.",
        ],
      },
    ],
  },
  {
    id: "rec",
    title: "Rec-center games",
    lead: "The ones with a court, a board, or a table that is not a card table.",
    image: "/graphics/clubs/shuffleboard.jpg",
    games: [
      {
        id: "shuffle",
        name: "Table shuffleboard",
        players: "2, or 4 as partners",
        image: "/graphics/clubs/shuffleboard.jpg",
        blurb: "Slide weights down a long wooden table. Hangers score. Weights in the kitchen do not.",
        more: "Table shuffleboard is the long table in the rec center, not the outdoor court. Players stand at one end and slide weights, called pucks, toward the scoring zones at the far end. A round is usually eight weights, four per side, alternating shots. Only the weights closer to the far edge than the opponent’s nearest weight score. The zones are typically 1, 2, and 3. A weight hanging over the end without falling is a hanger and scores 4 in many houses. A weight short of the scoring lines is in the kitchen and scores nothing. Knocking an opponent off is legal and is most of the game. Partners stand at opposite ends and shoot back the other way the next frame. Games are often to 15 or 21. Do not drop a weight. The table is waxed and proud.",
        tips: [
          "Ask if hangers count as 4.",
          "The kitchen is the dead zone in front of the one-line.",
          "Slide. Do not throw.",
        ],
      },
      {
        id: "court-shuffle",
        name: "Court shuffleboard",
        players: "2 or 4",
        image: "/graphics/clubs/shuffleboard.jpg",
        blurb: "The outdoor court with cues and biscuits. Same idea, longer walk.",
        more: "Court shuffleboard is played on a long concrete court. You push a disc, called a biscuit, with a cue. Four biscuits a side, alternating. Scoring zones at the far end are 7, 8, and 10. A biscuit in the 10 that is not touching a line is the prize. Biscuits on a line do not score. Knocking the other color out of a zone is the sport. Frames alternate ends. Games are often to 75 points. The court is fastest in the morning before the sun softens the wax, if the court is waxed. Walk around, not across, the playing surface.",
        tips: [
          "A biscuit touching a line is dead.",
          "Do not walk on the court in sandy shoes.",
          "75 is a common game. Ask.",
        ],
      },
      {
        id: "darts",
        name: "Darts",
        players: "1 or more · 501 and Cricket",
        image: "/graphics/clubs/bocce.jpg",
        blurb: "A clock face on the wall. 501 is a race down. Cricket is a race to close numbers.",
        more: "The board is hung so the bullseye is 5 feet 8 inches off the floor. You stand at the toe line, 7 feet 9¼ inches from the face of the board. In 501, each player starts at 501 and subtracts what they hit. Three darts a turn. The outer ring of a number is a double. The inner ring is a triple. Bull is 50, outer bull is 25. You must reach exactly zero, and the last dart must be a double. If you go past zero or land on 1, the turn is a bust and your score stays where it was. Cricket uses 20, 19, 18, 17, 16, 15, and the bull. You need three marks to close a number. A triple counts as three marks. Once you close a number, further hits on it score that number until your opponent closes it too. First to close everything and have the higher or equal point score wins. Steel-tip and soft-tip boards differ. Soft-tip is what most rec centers hang, and the machine does the arithmetic.",
        tips: [
          "Toes behind the line.",
          "Pull your own darts. Do not walk up while someone is still shooting.",
          "501 ends on a double. Cricket does not.",
        ],
      },
      {
        id: "ping",
        name: "Table tennis",
        players: "2, or 4 for doubles",
        image: "/graphics/clubs/pickleball.jpg",
        blurb: "First to 11, must win by 2. Serve backhand. Let bounces on your side only.",
        more: "Games are to 11 and you must win by 2. Serve from behind the end line. The ball has to bounce once on your side and once on theirs. In singles, serve from the right when your score is even and from the left when it is odd. The serve should be tossed up from an open palm and struck behind the end line, and the ball must be visible to the receiver. A let serve that clips the net and still lands in the right court is replayed. Volleys are legal after the serve has bounced once on each side. You may not touch the table with your free hand. Edges are in. Sides of the table are not. Doubles: the serve must go diagonally, and partners alternate hitting. Switch serve every 2 points. At 10–10, switch every point.",
        tips: [
          "11, win by 2. Not 21, unless the table voted otherwise.",
          "A net cord on the serve that lands in is a let, not a point.",
          "The white edge line on top is in.",
        ],
      },
      {
        id: "bocce",
        name: "Bocce",
        players: "2, or two teams of 2 to 4",
        image: "/graphics/clubs/bocce.jpg",
        blurb: "Get your balls closer to the pallino than theirs. Only the closest color scores.",
        more: "Bocce is played on a flat court. The small target ball is the pallino. One team tosses it out. Then players alternate rolling the larger balls as close to it as they can. You may knock the pallino or the other balls. After all eight balls are thrown, four per side, only the team with the ball closest to the pallino scores. They score one point for each of their balls that is closer than the opponent’s closest ball. The other team scores nothing that frame. First to 12 or 16 is a common game. Both feet stay inside the throwing end until the ball leaves your hand. A ball that hits the backboard and comes back is often dead. Ask.",
        tips: [
          "Only one team scores each frame.",
          "Measure before you pick up a ball. The argument is in the tape.",
          "The pallino can move. That is not a foul.",
        ],
      },
      {
        id: "cornhole",
        name: "Cornhole",
        players: "2, or 4 as partners",
        image: "/graphics/clubs/bocce.jpg",
        blurb: "Beanbags at a board 27 feet away. In the hole is 3. On the board is 1.",
        more: "Two boards face each other, 27 feet from the front of one to the front of the other. The hole is 6 inches across, centered 9 inches from the top. Partners stand at opposite boards. Each player throws four bags, alternating with the opponent at the same board. A bag through the hole is 3. A bag on the board is 1. A bag touching the ground is 0. Cancellation scoring is the usual rule: if you have 5 and they have 3, you score 2 for the round. First to 21 wins. You do not need to land exactly on 21 in the common backyard rules, but you must reach it. Some leagues require a win by 2. Bags should be about 6 inches and 15 to 16 ounces. Do not use a wet bag. It slides off and ruins the next person’s day.",
        tips: [
          "Cancellation scoring: equal points wipe out.",
          "27 feet is the front edge to the front edge, not a guess.",
          "Call your score before you pull the bags.",
        ],
      },
      {
        id: "horseshoes",
        name: "Horseshoes",
        players: "2, or 4",
        image: "/graphics/clubs/bocce.jpg",
        blurb: "Ringers are 3. Leaners are not ringers. The closer shoe scores if nobody rang it.",
        more: "Stakes are 40 feet apart for men and often 30 for shorter throws. Ask which distance the pit is set for. Each player throws two shoes per inning, alternating. A ringer is a shoe that encircles the stake so a straight edge could touch both heel calks and the stake. A ringer scores 3. If each side has a ringer, they cancel. The closest shoe within 6 inches of the stake scores 1, and two closer shoes of the same player can score 2. Leaners that touch the stake but are not ringers score as close shoes, not as 3. Games are often to 21 or 40. Pit sand is there so the shoe stops. It is not a sandbox.",
        tips: [
          "A leaner is not a ringer.",
          "Ringers cancel one for one.",
          "Stand to the side until both shoes are down.",
        ],
      },
      {
        id: "pickle",
        name: "Pickleball",
        players: "2 or 4",
        image: "/graphics/clubs/pickleball.jpg",
        blurb: "The full court guide already lives on the Pickleball page. This is the one-minute version.",
        more: "Pickleball is played on a badminton-sized court with a wiffle ball and a solid paddle. The serve is underhand and diagonal. Both sides must let the serve and the return bounce before anyone volleys. That is the double bounce. The kitchen is the 7-foot area on each side of the net. You may not volley while standing in it. You may step in after the ball bounces. Games are usually to 11, win by 2. Only the serving team scores in traditional side-out scoring. The server’s score is called first, then the receiver’s, then the server number in doubles. Rec-center open play rotates winners and splits strong pairs. The longer guide, the DUPR notes, and the court finder are on the Pickleball page.",
        tips: [
          "The kitchen rule is the one new players break.",
          "Call the score before you serve.",
          "Open play is social. Ask how the stack rotates.",
        ],
      },
      {
        id: "bowling",
        name: "Bowling",
        players: "Any number",
        image: "/graphics/clubs/shuffleboard.jpg",
        blurb: "Ten frames. A strike is 10 plus the next two balls. A spare is 10 plus the next ball.",
        more: "A game is 10 frames. You roll two balls a frame unless the first is a strike. A strike knocks all ten pins with the first ball and scores 10 plus the next two balls. A spare knocks the rest down with the second ball and scores 10 plus the next one ball. An open frame scores only the pins you knocked down. The tenth frame gives extra balls so a strike or spare can still add the bonus. A perfect game is 300. The arrows on the lane are for aiming, not for decoration. Rec-center leagues post the average. Your average is the truth. The one game you shot 180 is a story.",
        tips: [
          "The tenth frame is longer if you strike or spare.",
          "Stay behind the foul line. Crossing it zeros the shot.",
          "Let the sweeper finish before you step up.",
        ],
      },
      {
        id: "croquet",
        name: "Croquet",
        players: "2 to 6",
        image: "/graphics/clubs/bocce.jpg",
        blurb: "Hit the ball through the wickets in order. Hitting someone else’s ball earns you two extra shots.",
        more: "Backyard croquet, which is what most lawns play, uses six wickets and two stakes, or a shorter setup. Balls go through the wickets in a set order, down and back, and finish on the turning stake. You get one stroke a turn, plus extras. If your ball hits another ball, that is a roquet, and you get two extra strokes: a croquet shot with your foot on your ball, sending the other ball away, and then a continuation. Going through a wicket earns another stroke. You may not roquet the same ball again until you pass the next wicket. Association croquet on a full lawn is stricter and longer. If the group owns colored mallets and a firm opinion, they are playing a named ruleset. Ask which one before you send their ball into the shrubs.",
        tips: [
          "Wicket order matters. Coming back is not the same path.",
          "A roquet is a hit on another ball, and it is good.",
          "Ask if dead balls exist in this yard. Some yards never heard of them.",
        ],
      },
    ],
  },
  {
    id: "table",
    title: "Boards and tables at home",
    lead: "The games that live in a closet until company comes.",
    image: "/graphics/clubs/poker-cards.jpg",
    games: [
      {
        id: "sequence",
        name: "Sequence",
        players: "2 to 12, best as teams",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "Play a card, put a chip on that space. Five in a row wins.",
        more: "Sequence uses a board printed with two of every card except the jacks. On your turn you play one card from your hand and place a chip on a matching open space. Jacks are special. Two of them are one-eyed and remove an opponent’s chip. Two of them are two-eyed and let you place a chip anywhere. A sequence is five chips in a row, across, down, or diagonal. Teams need two sequences to win in the common three-person team game, one sequence in two-player. A chip already in a sequence can be part of a second one. You draw back up to a full hand after you play. You cannot have two chips on the same printed card if another copy is open, unless the board forces it.",
        tips: [
          "One-eyed jacks remove. Two-eyed jacks place.",
          "Corners are sometimes free wild spaces. Read the board.",
          "Five in a row. Not four.",
        ],
      },
      {
        id: "backgammon",
        name: "Backgammon",
        players: "2",
        image: "/graphics/clubs/mah-jongg.jpg",
        blurb: "Race your checkers home, then bear them off. Hitting a lone checker sends it to the bar.",
        more: "Each player has 15 checkers. They move in opposite directions around the board, according to the two dice. If you roll different numbers, you may move one checker the total or two checkers the separate numbers. A double is played twice, four moves. A point with two or more of your checkers is made and the opponent cannot land there. A single checker is a blot. If the opponent lands on it, it goes to the bar and must re-enter before that player can move anything else. Once all 15 of your checkers are in your home board, the six points nearest your edge, you bear them off by rolling the point numbers. First to bear off all 15 wins. The doubling cube raises the stake and is optional in a friendly game. If you use it, a player who is offered a double may take or pass. Passing loses the current stake.",
        tips: [
          "You cannot land on a point the opponent has made.",
          "A checker on the bar has to come in before any other move.",
          "The doubling cube is optional. Say so.",
        ],
      },
      {
        id: "chess",
        name: "Chess",
        players: "2",
        image: "/graphics/clubs/mah-jongg.jpg",
        blurb: "Checkmate the king. Capturing every piece is not the goal.",
        more: "White moves first. Pawns move forward one, or two on their first move, and capture diagonally. Rooks slide on ranks and files. Bishops slide on diagonals. The queen does both. The king moves one square any direction. Knights jump in an L, two squares one way and one to the side, and they are the only piece that jumps. Castling slides the king two squares toward a rook and brings that rook to the other side of the king, once, if neither has moved and the king is not in check and does not cross check. You may not move into check. Checkmate is when the king is in check and no legal move escapes. Stalemate is when the side to move is not in check and has no legal move, and the game is a draw. Touch-move is polite in a club: if you touch a piece, you move it, unless you say j’adoube, adjusting.",
        tips: [
          "You must get out of check if you can.",
          "Stalemate is a draw, not a win. Do not take the last escape and call it victory.",
          "Clocks, if you use one, should be agreed before the first move.",
        ],
      },
      {
        id: "checkers",
        name: "Checkers",
        players: "2",
        image: "/graphics/clubs/mah-jongg.jpg",
        blurb: "Diagonal moves, forced jumps, and kings that finally get to turn around.",
        more: "American checkers, English draughts, is an 8 by 8 board. Each side has 12 pieces on the dark squares. Pieces move diagonally forward one square. If an adjacent opponent has an empty square beyond, you jump and remove them. Jumps are mandatory. If more than one jump is on the board, you choose which piece jumps, then you must continue with that piece if another jump appears. A piece that reaches the far row becomes a king and may move and jump backward as well. You win by capturing every opposing piece or leaving them with no legal move. Flying kings, which slide like bishops, are not in this game. That is international draughts.",
        tips: [
          "Jumps are not optional.",
          "A king is crowned when it reaches the last row, and in many houses its turn ends there.",
          "Dark square on your left is the usual setup.",
        ],
      },
      {
        id: "rummy",
        name: "Rummy",
        players: "2 to 6",
        image: "/graphics/clubs/poker-cards.jpg",
        blurb: "The parent of gin and Phase 10. Draw, meld sets and runs, discard, go out.",
        more: "Basic rummy deals about 7 or 10 cards, depending on the crowd. Draw from the stock or take the top of the discard pile, lay down melds if you want, and discard. A meld is three or more of a rank, or a run of three or more in one suit. You may add to any meld on the table in many home games. First to lay off every card wins the hand. Everyone else scores the cards left in their hand against them, face cards 10, aces 1 or 11 by agreement. Gin, Shanghai, and contract rummy are stricter children of this game. If someone says ‘we play contract,’ they mean a list of required melds that changes each hand. Ask for the list.",
        tips: [
          "Ask whether you can add to other people’s melds.",
          "Aces high, low, or both is a house rule. It matters.",
          "Going out means your last card is a discard or a meld. Confirm which.",
        ],
      },
    ],
  },
];

export function HowToPlayGames() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = GROUPS.flatMap((group) => group.games).find((game) => game.id === openId) || null;

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
          <p className="panel-hint">
            These are the usual rules. A rec-center league or a Tuesday card
            club may have a one-page sheet that disagrees. Their sheet wins
            at their table. Pickleball’s longer guide is on the Pickleball
            page.
          </p>
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
              {group.games.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  className="about-panel trip-card"
                  onClick={() => setOpenId(game.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={game.image} alt="" />
                  <div className="trip-card-body">
                    <p className="ms-boat-meta">{game.players}</p>
                    <h3>{game.name}</h3>
                    <p>{game.blurb}</p>
                    <p className="trip-card-more">Rules and scoring</p>
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
                aria-labelledby="game-pop-title"
                onClick={(event) => event.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="trip-pop-art" src={open.image} alt="" />
                <div className="trip-pop-body">
                  <div className="ms-cal-pop-bar">
                    <p className="panel-hint" style={{ margin: 0 }}>
                      {open.players}
                    </p>
                    <button type="button" className="ms-cal-pop-close" onClick={() => setOpenId(null)}>
                      Close
                    </button>
                  </div>
                  <h3 id="game-pop-title">{open.name}</h3>
                  <p>{open.more}</p>
                  <ul className="trip-pop-tips">
                    {open.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <div className="hero-actions">
                    <a className="btn btn-ghost btn-sm" href="/club-zone">
                      Find a club
                    </a>
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
