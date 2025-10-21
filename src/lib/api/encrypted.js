import CryptoJS from "crypto-js";
const secret_key = process.env.NEXT_PUBLIC_SECRET_KEY;

export const encryptData = (data) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secret_key
    ).toString();
    return encryptedData;
  } catch (error) {
    console.error("Error encrypting data:", error);
  }
};

export const decryptData = (data) => {
  try {
    if (data) {
      const bytes = CryptoJS.AES.decrypt(data, secret_key);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    }
  } catch (error) {
    console.error("Error decrypting data:", error);
  }
  return null;
};

export const generateNewUniqueID = (row, index) => {
  const metalAlloyFamily = row?.alloyFamily?.toString().trim();
  const product = row?.productForm?.toString().trim();
  const gradeAlloy = row?.grade?.toString().trim();
  const specificationDetails = row?.specifications?.toString().trim();
  const primaryDimension = row?.primaryDimension?.toString().trim();
  if (!metalAlloyFamily || !gradeAlloy || !specificationDetails || !primaryDimension) {
    throw new Error("Missing required fields for generating Unique ID.");
  }

  // Extract the first digit from each word in Specification Details
  const specDetailsWords = specificationDetails.split(" ");
  const firstDigits = specDetailsWords.map(word => word.match(/\d/)).filter(match => match).map(match => match[0]);

  // Combine the fields to generate the new unique ID
  return `${metalAlloyFamily}/${product}/${gradeAlloy}/${firstDigits.join("")}/${primaryDimension}`;
};
export function generateUniqueID() {
  const timestamp = Date.now().toString(); // Get current timestamp as string
  const randomDigits = Math.floor(Math.random() * 1e6).toString().padStart(6, '0'); // Generate 6 random digits, padded with leading zeros

  // Combine timestamp and random digits to form a 14-digit unique ID
  let uniqueID = timestamp.slice(-8) + randomDigits; // Get the last 8 digits of timestamp and append random digits

  return uniqueID;
}
export const increasePrice = (price, isValid = false, competMarkup) => {
  if (!isValid) {
    return price;
  }

  const minValue = Number(competMarkup?.minValue) || 15;
  const maxValue = Number(competMarkup?.maxValue) || 25;
  const basePrice = Number(price);

  const randomPercentage = Math.random() * (maxValue - minValue) + minValue;
  const increasedPrice = basePrice + (basePrice * (randomPercentage / 100));

  return increasedPrice.toFixed(2);
};
