 export const formatPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters from the phone number
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Apply the format "(xxx) xxx-xxxx" to the cleaned phone number
    const formattedPhoneNumber = cleanedPhoneNumber.replace(
        /(\d{3})(\d{3})(\d{4})/,
        '($1) $2-$3'
    );

    return formattedPhoneNumber;
}