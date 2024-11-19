import { Listing } from "./Listing";

export class Listings {
  constructor(Listings = []) {
    this.Listings = Listings.map(
      (Listing) =>
        new Listing(
          Listing._count,
          Listing.description,
          Listing.created,
          Listing.id,
          Listing.media,
          Listing.tags,
          Listing.title,
          Listing.updated,
          Listing.seller,
          Listing.bids,
          Listing.endsAt,
        )
    );
  }
}
