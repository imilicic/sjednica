export class User {
    CouncilMember?: boolean
    CouncilMemberStartEnd?: {StartDate: string, EndDate: string}[]
    Email: string
    FirstName: string
    LastName: string
    Password?: string
    UserId: number
    PhoneNumber?: string
    RoleName: string
}
