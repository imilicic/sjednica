import { FormGroup } from '@angular/forms';

export function areEqual(key1: string, key2: string) {
    return (formGroup: FormGroup) => {
        let value1 = formGroup.controls[key1].value;
        let value2 = formGroup.controls[key2].value;

        if (value1 !== value2) {
            return {
                notEqual: true
            }
        }

        return null;
    }
}

export function dateValidator(todayBetweenStartAndEnd: boolean) {
    return (formGroup: FormGroup) => {
        let startDay = +formGroup.controls['startDay'].value;
        let startMonth = +formGroup.controls['startMonth'].value - 1;
        let startYear = +formGroup.controls['startYear'].value;

        let endDay = +formGroup.controls['endDay'].value;
        let endMonth = +formGroup.controls['endMonth'].value - 1;
        let endYear = +formGroup.controls['endYear'].value;

        let startDate = new Date(startYear, startMonth, startDay);
        let endDate = new Date(endYear, endMonth, endDay);

        let invalidDate = {
            startDateInvalid: false,
            endDateInvalid: false
        }

        // (must check!)
        // checking if startDate is valid (eg. 30 of February is invalid)
        if (startDate.getDate() !== startDay || startDate.getMonth() !== startMonth || startDate.getFullYear() !== startYear) {
            invalidDate.startDateInvalid = true;
        }

        // (must check!)
        // checking if endDate is valid (eg. 30 of February is invalid)
        if (endDate.getDate() !== endDay || endDate.getMonth() !== endMonth || endDate.getFullYear() !== endYear) {
            invalidDate.endDateInvalid = true;
        }

        // returns invalid date if start or end date is invalid
        if (invalidDate.startDateInvalid || invalidDate.endDateInvalid) {
            return invalidDate;
        }

        // (must check!)
        // checking if startDate is before endDate
        if (startDate >= endDate) {
            return {
                startDateAfterEndDate: true
            }
        }

        // (optional check!)
        // checking if today is between startDate and endDate
        if (todayBetweenStartAndEnd) {
            let now = new Date();

            if (!(startDate <= now && now <= endDate)) {
                return {
                    nowNotBetweenStartEnd: true
                }
            }
        }

        return null;
    }
}
