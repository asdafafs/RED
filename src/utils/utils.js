export function formatTransmissions(item) {
    const includes1 = item.includes(1);
    const includes2 = item.includes(2);
    if (includes1 && includes2) {
        return 'АКП, МКП';
    } else if (includes1) {
        return 'МКП';
    } else if (includes2) {
        return 'АКП';
    } else {
        return '';
    }
}

export function formatCity(item) {
    const includes1 = item.includes(1);
    const includes2 = item.includes(2);
    if (includes1 && includes2) {
        return 'Северодвинск, Новодвинск';
    } else if (includes1) {
        return 'Северодвинск';
    } else if (includes2) {
        return 'Новодвинск';
    } else {
        return '';
    }
}