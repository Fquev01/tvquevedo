import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.tvmaze.com",
  timeout: 10000,
});

export async function searchShows(query) {
  const { data } = await api.get("/search/shows", { params: { q: query } });
  return data; 
}

export async function getTodaySchedule(country, dateISO) {
  const { data } = await api.get("/schedule", {
    params: { country, date: dateISO },
  });
  return data; // array de episodios programados hoy
}

export async function getShowById(id) {
  const { data } = await api.get(`/shows/${id}`);
  return data;
}

export async function getEpisodesByShowId(id) {
  const { data } = await api.get(`/shows/${id}/episodes`);
  return data;
}
