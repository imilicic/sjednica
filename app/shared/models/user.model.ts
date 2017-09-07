import { CouncilMembership } from './council-membership.model';

export class User {
    CouncilMemberships?: CouncilMembership[]
    Email: string
    FirstName: string
    LastName: string
    OldPassword?: string
    Password: string
    PhoneNumber?: string
    RoleId: number
    UserId: number
}
