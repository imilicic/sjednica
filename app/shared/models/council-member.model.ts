import { CouncilMembership } from './council-membership.model';

export class CouncilMember {
    CouncilMemberId: number
    Email: string
    EndDate: string
    FirstName: string
    History: CouncilMembership[]
    LastName: string
    PhoneNumber: string
    RoleId: number
    StartDate: string
}
