export class AgendaItem {
    AgendaItemId: number
    Documents?: Document[]
    Number: number
    Text: string
}

class Document {
    Description: string
    DocumentId: number
    URL: string
}
