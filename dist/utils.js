export const alignInvrt = {
    start: 'end',
    middle: 'middle',
    end: 'start',
};
export function inheritedProps(props) {
    const inheritedProps = ['fillChar', 'fg', 'textAlign', 'bg', 'underline', 'noBlink', 'invert', 'doubleWidth', 'doubleHeight'];
    const result = {};
    let inheritedProp;
    for (inheritedProp of inheritedProps) {
        // @ts-ignore
        if (inheritedProp in props)
            result[inheritedProp] = props[inheritedProp];
    }
    return result;
}
