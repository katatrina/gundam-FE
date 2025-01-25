const maskPhoneNumber = (phoneNumber: string): string => {
  // Only show the first 3 digits and the last 4 digits
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
}

export { maskPhoneNumber }
