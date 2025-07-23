import axios from "axios";
import { BASE_URL } from "../utils/constant";

export const fetchProvinces = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/administration/province`);
  return res.data.data.map((item: any) => ({
    value: String(item.id),
    label: item.name,
  }));
};

export const fetchCities = async (provinceId: string) => {
  const res = await axios.get(`${BASE_URL}/api/v1/administration/city/${provinceId}`);
  return res.data.data.map((item: any) => ({
    value: String(item.id),
    label: item.name,
  }));
};

export const fetchDistricts = async (cityId: string) => {
  const res = await axios.get(`${BASE_URL}/api/v1/administration/district/${cityId}`);
  return res.data.data.map((item: any) => ({
    value: String(item.id),
    label: item.name,
  }));
};

export const fetchSubdistricts = async (districtId: string) => {
  const res = await axios.get(`${BASE_URL}/api/v1/administration/subdistrict/${districtId}`);
  return res.data.data.map((item: any) => ({
    value: String(item.id),
    label: item.name,
  }));
};
