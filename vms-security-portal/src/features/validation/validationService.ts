// src/features/validation/validationService.ts

import { apiClient, handleApiError } from "@/api/apiClient";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";
import type { ValidationResult, ValidationResponse, RecentValidation } from "./validationTypes";

const SECURITY_URL = "/security";

/**
 * Validate a manually entered 5-character access code.
 * POST /security/validate
 */
export async function validateAccessCode(code: string): Promise<ValidationResponse> {
	try {
		const response = await apiClient.post<ApiResponse<any>>(
			`${SECURITY_URL}/validate`,
			{ code }
		);

		const data = response.data.data;

		const formatted: ValidationResult = {
			id: data.id,
			code: data.code,
			result: data.result,
			// ✅ FIX: Correctly map nested visitor info from API response
			visitorName: data.visitor_info?.name, 
			// ✅ FIX: Correctly map nested resident info from API response
			residentName: data.resident_info?.name, 
			// ✅ FIX: Correctly map nested home details from API response
			homeDetails: data.resident_info?.home, 
			validated_at: data.validated_at,
			message: data.message,
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
		// NOTE: Assuming the validate-qr endpoint returns the same nested structure as /validate
		const response = await apiClient.post<ApiResponse<any>>(
			`${SECURITY_URL}/validate-qr`,
			{ qr_data: qrData }
		);

		const data = response.data.data;

		const formatted: ValidationResult = {
			id: data.id,
			code: data.code,
			result: data.result,
			// Applying the same mapping fix for QR validation
			visitorName: data.visitor_info?.name, 
			residentName: data.resident_info?.name, 
			homeDetails: data.resident_info?.home, 
			validated_at: data.validated_at,
			message: data.message,
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

		// ✅ FIX: extract from response.data.data.validations, not response.data.validations
		const validations = response.data?.data?.validations || [];

		return {
			success: true,
			data: { validations },
		};
	} catch (error) {
		return handleApiError(error);
	}
}