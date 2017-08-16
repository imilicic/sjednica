import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'meetingType'
})

export class MeetingTypePipe implements PipeTransform {
    transform(value: string, ...args: any[]): string {
        switch (value) {
            case 'electronic remotely':
                return 'elektronska udaljena';
            case 'electronic localy':
                return 'elektronska lokalna';
            case 'non electronic':
                return 'neelektronska';
        }
    }
}