import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function login(email: string, password: string): Promise<string> {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  return data.access_token;
}
