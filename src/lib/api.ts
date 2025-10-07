import type { CatalogItem } from "./catalog";
import type { Department } from "./department";
import type { Term } from "./term";

const R2_BASE_URL = "https://static.moosescheduler.com";

async function fetchFromR2<T>(path: string): Promise<T> {
  const response = await fetch(`${R2_BASE_URL}/${path}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${path}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export function fetchTerms(): Promise<Term[]> {
  return fetchFromR2<Term[]>("uvm/terms.json");
}

export function fetchDepartments(termId = "202509"): Promise<Department[]> {
  return fetchFromR2<Department[]>(`uvm/subjects_${termId}.json`);
}

export function fetchCatalog(termId: string): Promise<CatalogItem[]> {
  return fetchFromR2<CatalogItem[]>(`uvm/catalog_${termId}.json`);
}
