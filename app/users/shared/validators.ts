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
