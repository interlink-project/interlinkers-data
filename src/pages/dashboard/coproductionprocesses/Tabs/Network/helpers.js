
export const colorSwitch = (familyMatch) => {
    let color = 'grey';

    if (familyMatch) {
        switch (familyMatch[0]) {
        case('stakeholder'):
            color = 'seagreen';
            break;
        case('main'):
            color = 'salmon';
            break;
        case('working'):
            color = 'blue';
            break;
        case('other2'):
            color = 'skyblue';
            break;
        default:
            color = 'grey';
        }
    }

    return color;
};

export const familyMatchChecker = (str) => str.match(/main|working|stakeholder/);