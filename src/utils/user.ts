const maskPhoneNumber = (phoneNumber: string): string => {
  // Only show the last 3 digits of the phone number
  // Only show the last 3 digits of the phone number
  return phoneNumber.replace(/\d(?=\d{3})/g, '*');
}

export { maskPhoneNumber }
