export const generateInstructorUniqueId = (
    centerCode: string,
    date: Date,
    serialNumber: number
): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    const formattedDate = `${day}${month}${year}`;
    const formattedSerial = String(serialNumber).padStart(4, "0");

    return `${centerCode}-${formattedDate}-I${formattedSerial}`;
};