import { AgendaItem } from './agenda-item.model';

export class Meeting {
    Address: string
    AgendaItems: AgendaItem[]
    City: string
    DateTime: string
    MeetingId: number
    Number: number
    NumberInYear: number
    Type: string
}
