import { CouncilMembership } from './council-membership.model';

export class User {
    CouncilMemberships?: CouncilMembership
    Email: string
    FirstName: string
    LastName: string
    Password?: string
    UserId: number
    PhoneNumber?: string
    RoleName: string
}
