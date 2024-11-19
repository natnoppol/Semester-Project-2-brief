export class Listing {
    constructor(
      _count,
      description,
      created,
      id,
      media = [],
      tags,
      title,
      updated,
      seller,
      bids = [],
      endsAt
    ) {
      this._count = _count;
      this.description = description;
      this.created = created;
      this.id = id;
      this.media = media;
      this.tags = tags;
      this.title = title;
      this.updated = updated;
      this.seller = seller;
      this.bids = bids;
      this.endsAt = endsAt;
    }
  }
  