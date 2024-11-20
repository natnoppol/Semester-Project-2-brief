import { Listing } from "./Listing";

export class Listings {
  constructor(listings = []) {
    this.listings = listings.map(
      (listing) =>
        new Listing(
          listing._count,
          listing.description,
          listing.created,
          listing.id,
          listing.media,
          listing.tags,
          listing.title,
          listing.updated,
          listing.seller,
          listing.bids,
          listing.endsAt,
        )
    );
  }
}
