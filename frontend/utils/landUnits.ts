/**
 * Thai Land Unit Conversions
 *
 * Standard Thai land units:
 * 1 ไร่ (Rai) = 1,600 ตารางเมตร (sqm)
 * 1 งาน (Ngan) = 400 ตารางเมตร (sqm)
 * 1 ตารางวา (Wa) = 4 ตารางเมตร (sqm)
 *
 * Government standard for tree bank calculations
 */

export const RAI_TO_SQM = 1600;
export const NGAN_TO_SQM = 400;
export const WA_TO_SQM = 4;

export interface ThaiLandUnit {
  rai: number;
  ngan: number;
  wa: number;
}

/**
 * Convert Thai land units (ไร่-งาน-วา) to square meters
 *
 * @example
 * raiToSqm(5, 2, 50) // Returns 9000 (5 rai 2 ngan 50 wa = 9,000 sqm)
 */
export const raiToSqm = (rai: number, ngan: number = 0, wa: number = 0): number => {
  return (rai * RAI_TO_SQM) + (ngan * NGAN_TO_SQM) + (wa * WA_TO_SQM);
};

/**
 * Convert square meters to Thai land units (ไร่-งาน-วา)
 *
 * @example
 * sqmToRai(9000) // Returns { rai: 5, ngan: 2, wa: 50 }
 */
export const sqmToRai = (sqm: number): ThaiLandUnit => {
  const rai = Math.floor(sqm / RAI_TO_SQM);
  const remaining = sqm % RAI_TO_SQM;
  const ngan = Math.floor(remaining / NGAN_TO_SQM);
  const wa = Math.floor((remaining % NGAN_TO_SQM) / WA_TO_SQM);
  return { rai, ngan, wa };
};

/**
 * Format Thai land units as string
 *
 * @example
 * formatThaiLandUnit(5, 2, 50) // Returns "5 ไร่ 2 งาน 50 วา"
 * formatThaiLandUnit(0, 0, 0) // Returns "0 ไร่"
 */
export const formatThaiLandUnit = (rai: number, ngan: number = 0, wa: number = 0): string => {
  const parts: string[] = [];
  if (rai > 0) parts.push(`${rai} ไร่`);
  if (ngan > 0) parts.push(`${ngan} งาน`);
  if (wa > 0) parts.push(`${wa} วา`);
  return parts.join(' ') || '0 ไร่';
};

/**
 * Format square meters with Thai units
 *
 * @example
 * formatAreaWithThaiUnits(9000) // Returns "9,000 ตร.ม. (5 ไร่ 2 งาน 50 วา)"
 */
export const formatAreaWithThaiUnits = (sqm: number): string => {
  const { rai, ngan, wa } = sqmToRai(sqm);
  const thaiUnit = formatThaiLandUnit(rai, ngan, wa);
  return `${sqm.toLocaleString('th-TH')} ตร.ม. (${thaiUnit})`;
};

/**
 * Validate Thai land units are non-negative
 */
export const validateThaiLandUnits = (rai: number, ngan: number = 0, wa: number = 0): boolean => {
  return rai >= 0 && ngan >= 0 && wa >= 0;
};
