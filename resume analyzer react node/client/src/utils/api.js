import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const api = axios.create({ baseURL: apiURL });

export async function parsePdf(file) {
  const form = new FormData();
  form.append('resume', file);
  const { data } = await api.post('/resume/parse-pdf', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function analyzeResume(resumeText) {
  const { data } = await api.post('/resume/analyze', { resumeText });
  return data;
}

export async function matchJob(resumeText, jobDescription) {
  const { data } = await api.post('/resume/match', { resumeText, jobDescription });
  return data;
}