export const getObject = (
  list: object[],
  attribute: string,
  value: any,
  getAll: boolean = false
): object | object[] | null => {
  if (list === undefined) return null
  let obj = list.filter((item: any) => String(item[attribute]) === String(value));
  if (obj === null || obj === undefined || obj.length === 0) return null;
  else return getAll ? obj : obj[0];
};

export const getRouteName = (url: string) => {
  let arr = url.split('/')
  if (arr.includes('google') && arr.includes('auth'))
    return 'google'
  else if (arr.includes('linkedin') && arr.includes('auth'))
    return 'linkedin'
  else if (arr.includes('apple') && arr.includes('auth'))
    return 'apple'
  else
    return arr[arr.length - 1]
}

/**
 * Helper function to validate if the required attributes are present in an object.
 * 
 * @param obj - The object to validate.
 * @param requiredAttributes - An array of strings representing the required attributes.
 * @returns An object with `valid` boolean and an `errors` array containing any validation errors.
 */
export const validateArrayObject = (
  obj: Record<string, any>,
  requiredAttributes: Array<string>
): { valid: boolean, errors: string[] } => {
  const errors: string[] = [];

  // Loop through the required attributes and check if they exist in the object
  obj.forEach((object: any) => {
    requiredAttributes.map((attribute: any) => {
      if (object[attribute] === undefined || object[attribute] === null) {
        errors.push(`${attribute} is required in object.`);
      }
    })
  })
  // If no errors, the object is valid
  const isValid = errors.length === 0;
  return {
    valid: isValid,
    errors
  };
};

export const valueExistsInObject = (obj: object, value: string) => {
  // Helper function to check value in object recursively
  const checkValue = (obj: any) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively check nested objects
          if (checkValue(obj[key])) {
            return true;
          }
        } else if (String(obj[key].toLowerCase()) === String(value.toLowerCase())) {
          // If the value matches
          return true;
        }
      }
    }
    return false;
  };

  return checkValue(obj);
}

export const isUndefinedOrEmpty = (data: any) => {
  if (data === undefined || data === "" || data === null || data === "null")
    return true
  else 
    return false
}

