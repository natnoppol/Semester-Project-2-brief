export class Profile {
    constructor(
      _count = {},
      avatar = {},
      banner = {},
      bio = [],
      email = '',
      listings = [],
      wins = [],
      name = '',
      credits = '',
    ) {
      this._count = _count;
      this.avatar = avatar;
      this.banner = banner;
      this.bio = bio;
      this.email = email;
      this.listings = listings;
      this.wins = wins;
      this.name = name;
      this.credits = credits;
    }
  }
    
    