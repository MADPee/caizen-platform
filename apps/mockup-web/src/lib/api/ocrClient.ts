export type UploadResponse = { task_id: string; status: string };
export type StatusResponse = {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  document_type?: string;
  confidence?: number;
};
export type ResultsResponse = {
  status: string;
  document_type?: string;
  confidence?: number;
  extracted_data?: any;
  manual_review_needed?: boolean;
};

const API_BASE = import.meta.env.VITE_OCR_API_URL as string;

export async function uploadDocument(file: File): Promise<UploadResponse> {
  if (!API_BASE) throw new Error('VITE_OCR_API_URL missing');
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function getStatus(taskId: string): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE}/api/process/${taskId}`);
  if (!res.ok) throw new Error(`Status failed: ${res.status}`);
  return res.json();
}

export async function getResults(taskId: string): Promise<ResultsResponse> {
  const res = await fetch(`${API_BASE}/api/results/${taskId}`);
  if (!res.ok) throw new Error(`Results failed: ${res.status}`);
  return res.json();
}

