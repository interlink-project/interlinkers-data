export const cleanUnderScores = (str) => str && (str.charAt(0).toUpperCase() + str.slice(1)).replace(/_/g, ' ');
