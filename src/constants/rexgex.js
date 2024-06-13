export const validName =/^[a-zA-Z\s'.]*$/; //Example valid matches: "John", "John Doe", "John O'Conner", "John Doe Jr."

export const lettersNumbersAndSpecialCharacters = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; //Example valid matches: "John", "John Doe", "John123", "John123!", "John123!@

export const uppercaseAndLowercaseLetters = /^[a-zA-Z\s]*$/;//Example valid matches: "John", "John Doe", "John O'Conner", "John Doe Jr."
export const validNoWhiteSpaceOrSpecialCharactersOrNumbers = /^[a-zA-Z\s]*$/;//Example valid matches: "John", "John Doe", "John O'Conner", "John Doe Jr."

export const numberUpTo2DecimalPlaces = /^(?!^0\d|^\d{1,3}(?:,\d{3})+)(?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d{1,2})?$/;//Example valid matches: "1", "1.0", "1.00", "1,000", "1,000.00", "1,000,000.00"

export const validWholeNumber = /^\d+$/; //Alternative: /^[0-9]*$/; Example valid matches: "1", "100", "1000"

export const validPhoneNumber = /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/;//Example valid matches: "1234567890", "123-456-7890"

export const validEmail = /\S+@\S+\.\S+/; //Alternative: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //Example valid matches: sample@email.com

export const validFullStreetAddress = /^\d+\s[A-Za-z0-9\s.,#-]+,\s[A-Za-z\s]+,\s[A-Za-z]{2}\s\d{5}(?:-\d{4})?$/;//Example valid matches: "123 Main St, Anytown, NY 12345", "123 Main St, Anytown, NY 12345-6789"

export const validHTMLDateInput = /^\d{4}-\d{2}-\d{2}$/;//Example valid matches: "2021-01-01"

export const validSSN = /^(?:\d{9}|\d{3}-\d{2}-\d{4})$/;//Example valid matches: "123456789", "123-45-6789"

export const validAnyString = /^(?!\s*$)[\w\s\S]+$/;//Example valid matches: "John", "John Doe", "John O'Conner", "John Doe Jr."

export const validStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;//Example valid matches: "Password1!", "Password123!", "Password1234!"

export const validUserName = /^[a-zA-Z0-9_]*$/;//Example valid matches: "John", "JohnDoe", "John_Doe", "John123", "John_Doe123"