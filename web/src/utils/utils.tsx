export const phoneSubString = (phoneNo: string) => {
    console.log("phoneNo", phoneNo)
    const netCode = phoneNo.slice(0, 1);
    if (netCode === '+') {
        return <span>(<span>{phoneNo.substring(0, 4)}</span>{' '}
            <span> {phoneNo.substring(4, 7)}</span>
            <span>-{phoneNo.substring(7, 10)}</span>
            <span>-{phoneNo.substring(10)}</span>)</span>
    } else {
        return <span>(<span>+{phoneNo.substring(0, 3)}</span>{' '}
            <span> {phoneNo.substring(3, 6)}</span>
            <span>-{phoneNo.substring(6, 9)}</span>
            <span>-{phoneNo.substring(9)}</span>)</span>
    }

}