interface ClientIdentity {
  clientName: string;
  email: string;
  phone: string;
}

const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

const normalizePart = (value: string): string => value.trim().toLowerCase();

export async function computeClientKey(identity: ClientIdentity): Promise<string> {
  const normalized = [
    identity.clientName ?? '',
    identity.email ?? '',
    identity.phone ?? '',
  ].map(normalizePart).join('|');

  if (typeof window !== 'undefined' && window.crypto?.subtle?.digest) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(normalized);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return bufferToHex(digest);
    } catch (error) {
      console.error('Failed to compute client key hash, falling back to plain string:', error);
    }
  }

  return normalized;
}
