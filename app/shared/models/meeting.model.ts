export class Meeting {
    MeetingId: number
    Address: string
    City: string
    DateTime: Date
    Number: number
    NumberInYear: number
    Type: string
    AgendaItems: [{Number: number, Text: string}]
}
