import { hasKey } from './helper';

export function getCheckbox(context, key, label) {
    if (hasKey(context, key)) {
        const chkBoxNames = context[key].checkbox.name;
        if (hasKey(chkBoxNames, label)) {
            const loadName = context[key].checkbox.name[label]
            const chkBoxVal = context[key].checkbox.values[loadName]
            return chkBoxVal;
        } else {
            throw new Error(`${label} key not found`);
        }
    } else {
        throw new Error(`${key} not found`)
    }
}

