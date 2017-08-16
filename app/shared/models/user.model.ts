export class User {
    CouncilMember?: boolean
    CouncilMemberStartEnd?: {StartDate: Date, EndDate: Date}[]
    Email: string
    FirstName: string
    LastName: string
    Password?: string
    UserId: number
    PhoneNumber?: string
    RoleName: string
}
