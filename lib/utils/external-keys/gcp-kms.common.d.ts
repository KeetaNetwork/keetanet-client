import type { KeyManagementServiceClient } from '@google-cloud/kms';
export interface GCPKMSKeyConfig {
    projectId: string;
    locationId: string;
    keyRingId: string;
    keyId: string;
    versionId?: string;
}
/**
 * Parse a full KMS key name into its components.
 * Example: projects/<project_name>/locations/<location>/keyRings/<keyRingName>/cryptoKeys/<keyName>
 */
export declare function parseGCPKMSKeyName(fullName: string): GCPKMSKeyConfig;
/**
 * Build a full KMS key resource name from components.
 */
export declare function buildGCPKMSKeyNameBase(gcpKMSClientClass: typeof KeyManagementServiceClient, config: GCPKMSKeyConfig, lookupVersion?: boolean): Promise<string>;
