"use client";
import { useState, useEffect } from "react";
import getToken from "@/lib/getToken";
import CreateInstitution from './addInstitution';
import DeleteInstitution from "./deleteInstitution";
import UpdateInstitution from './updateInstitution';
import { apiUrl } from "@/lib/env";
import { Sidebar } from '@/components/Sidebar';

interface Institution {
  id: number;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
}


async function fetchInstitutions() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const response = await fetch(
      `${apiUrl}/api/v1/institutes`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error details:", errorDetails);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Cannot fetch Institutions", error);
    return { institutes: [] }; // Return an empty array if there's an error
  }
}

export default function Institution() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInstitutions = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state before fetching

        const data = await fetchInstitutions();
        // Tambahkan pesan ke setiap institusi
      const institutionsWithMessage = data.institutes.map((institution: Institution) => ({
        ...institution,
        message: data.message,
      }));

      setInstitutions(institutionsWithMessage);

      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    getInstitutions();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin"/>
      <div className="bg-white p-6 rounded-lg shadow space-y-4 w-full">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold mb-4">Institution List</h2>
      <CreateInstitution/>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Institution Name</th>
              <th className="border px-4 py-2 text-center">Message</th>
              <th className="border px-4 py-2 text-center">Created</th>
              <th className="border px-4 py-2 text-center">Updated</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((institution) => (
              <tr key={institution.id}>
                <td className="border px-4 py-2">{institution.name}</td>
                <td className="border px-4 py-2">{institution.message}</td>
                <td className="border px-4 py-2">{institution.created_at}</td>
                <td className="border px-4 py-2">{institution.updated_at}</td>
                <td className="border py-2 text-center flex gap-2 justify-center">
                  <UpdateInstitution institution={institution}/>
                  <DeleteInstitution institution={institution}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}
