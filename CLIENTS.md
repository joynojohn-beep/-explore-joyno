# Client gallery update — October 16, 2026

Source: user-supplied client and channel list in this conversation. Includes every supplied organization and Gino's profile: 55 entries, 244 links. Grouping follows the document: 39 JOYNO MEDIA clients, 12 Casa Amorosa clients, 3 company profiles (JOYNO MEDIA, JOYNO INC, Casa Amorosa), and 1 team profile (Gino Cabanas). The existing Moreno Pizza PH reference remains, for 56 gallery cards total.

Each entry has a stable `#project/<slug>` link, a typography card, a labeled profile panel and all supplied website/social destinations. Both the 3D gallery panel and standard HTML portfolio use the same data. Filters follow the supplied affiliation groups rather than guessing service assignments. Search matches names and groups. Native expandable links work even with JavaScript disabled.

## Import decisions

- Separated Hyderabad Dine In from The Artiste, whose heading was pasted on the preceding YouTube line.
- Added HTTPS to bare website domains.
- Converted LinkedIn `/company/<id>/admin/...` URLs to `/company/<id>/` public company URLs, keeping the supplied company ID.
- Converted Simply Rich's YouTube Studio link to the public channel URL, keeping the supplied channel ID.
- Removed tracking/referral parameters while preserving functional Facebook profile IDs and platform paths.
- Preserved supplied brand spellings, including ONEILS and B&W Customized Furnitures.
- Retained the supplied Facebook share URLs, Sollenne short link, and Tononiya staging-domain link. No replacement destination was guessed.
- Kept multiple Historia Art branch profiles as separately labeled channels.
- The source's standalone `www.linkedin.com` fragment was not a distinct profile and was omitted.

The user supplied the client relationships and links. No new service scope, deliverables, outcomes, client logos or case-study claims were inferred. External destination availability and third-party sign-in requirements have not been certified; the stored URLs are publicly addressed profiles rather than admin interfaces. Client artwork is original typography, not an official brand asset.

Edit `src/clients.ts` to maintain names, affiliations and links. Supplied links are also rendered into production HTML by the prerender step. The previous editable placeholder projects were removed.
