"use server";

import { createCity, updateCity, deleteCity, createClinic, updateClinic, deleteClinic } from "../admin/actions";

export async function handleCreateCity(data: FormData) {
  return createCity(data);
}

export async function handleUpdateCity(data: FormData) {
  return updateCity(data);
}

export async function handleDeleteCity(data: FormData) {
  return deleteCity(data);
}

export async function handleCreateClinic(data: FormData) {
  return createClinic(data);
}

export async function handleUpdateClinic(data: FormData) {
  return updateClinic(data);
}

export async function handleDeleteClinic(data: FormData) {
  return deleteClinic(data);
}
