// src/features/validation/validationService.ts

import { apiClient, handleApiError } from "@/api/apiClient";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";
import type { ValidationResult, ValidationResponse, RecentValidation, HomeDetails } from "./validationTypes";

const SECURITY_URL = "/security";

// Define the shape of the raw data from the API
interface RawValidationData {
  id: string;
  code: string;
  result: 'granted' | 'denied';
  visitor_info?: { name: string };
  resident_info?: { name: string; home: HomeDetails };
  validated_at: string;
  message: string;
  reason?: string;
}

/**
 * Validate a manually entered 5-character access code.
 * POST /security/validate
 */
export async function validateAccessCode(code: string): Promise<ValidationResponse> {
	try {
        // Use RawValidationData for the expected API response
		const response = await apiClient.post<ApiResponse<RawValidationData>>(
			`${SECURITY_URL}/validate`,
			{ code }
		);

		const rawData = response.data.data;

        // Map the raw data to the clean ValidationResult type
		const formatted: ValidationResult = {
			id: rawData.id,
			code: rawData.code,
			result: rawData.result,
			visitorName: rawData.visitor_info?.name, 
			residentName: rawData.resident_info?.name, 
			homeDetails: rawData.resident_info?.home, 
			validated_at: rawData.validated_at,
			message: rawData.message,
      reason: rawData.reason,
		};

		return { ...response.data, data: formatted };
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * Validate a QR code scanned by the security officer.
 * POST /security/validate-qr
 */
export async function validateQRAccessCode(qrData: string): Promise<ValidationResponse> {
	try {
		const response = await apiClient.post<ApiResponse<RawValidationData>>(
			`${SECURITY_URL}/validate-qr`,
			{ qr_data: qrData } 
		);

		const rawData = response.data.data;

        // Map the raw data to the clean ValidationResult type
		const formatted: ValidationResult = {
			id: rawData.id,
			code: rawData.code,
			result: rawData.result,
			visitorName: rawData.visitor_info?.name, 
			residentName: rawData.resident_info?.name, 
			homeDetails: rawData.resident_info?.home, 
			validated_at: rawData.validated_at,
			message: rawData.message,
      reason: rawData.reason
		};

		return { ...response.data, data: formatted };
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * Fetch recent validation logs by this security officer.
 * GET /security/recent-validations?limit=20
 */
export async function getRecentValidations(
	limit = 20
): Promise<ApiResponse<{ validations: RecentValidation[] }> | ApiErrorResponse> {
	try {
		const token = localStorage.getItem("token");

		const response = await apiClient.get<ApiResponse<{ validations: RecentValidation[] }>>(
			`${SECURITY_URL}/recent-validations?limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const validations = response.data?.data?.validations || [];

		return {
			success: true,
			data: { validations },
		};
	} catch (error) {
		return handleApiError(error);
	}
}
