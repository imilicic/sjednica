import { AgendaItem } from './agenda-item.model';

export class Meeting {
    Address: string
    AgendaItems: AgendaItem[]
    City: string
    DateTime: Date
    MeetingId: number
    Number: number
    NumberInYear: number
    TypeId: number
}
