export class RebrandlyLink {
    id: string;
    title: string;
    slashtag: string;
    destination: string;
    createdAt: string;
    updatedAt: string;
    shortUrl: string;
    domain: RebrandlyDomain;
}

export class RebrandlyDomain {
    id: string;
    ref: string;
    fullName: string;
}
