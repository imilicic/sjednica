import { FormGroup } from '@angular/forms';

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

        // (must check!)
        // checking if startDate is valid (eg. 30 of February is invalid)
        if (startDate.getDate() !== startDay || startDate.getMonth() !== startMonth || startDate.getFullYear() !== startYear) {
            return {
                startDateInvalid: true
            }
        }

        // (must check!)
        // checking if endDate is valid (eg. 30 of February is invalid)
        if (endDate.getDate() !== endDay || endDate.getMonth() !== endMonth || endDate.getFullYear() !== endYear) {
            return {
                endDateInvalid: true
            }
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
