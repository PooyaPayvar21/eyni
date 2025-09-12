"use server";

import * as adminActions from "./actions";

export async function createCity(formData: FormData) {
  return adminActions.createCity(formData);
}

export async function updateCity(formData: FormData) {
  return adminActions.updateCity(formData);
}

export async function deleteCity(formData: FormData) {
  return adminActions.deleteCity(formData);
}

export async function createClinic(formData: FormData) {
  return adminActions.createClinic(formData);
}

export async function updateClinic(formData: FormData) {
  return adminActions.updateClinic(formData);
}

export async function deleteClinic(formData: FormData) {
  return adminActions.deleteClinic(formData);
}
