import { useState } from "react";
import { Button } from "@/components/ui/button";
import getToken from "@/lib/getToken";

import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/env";

interface Institution {
  id: number;
  name: string;
}

interface DeleteInstitutionProps {
  institution: Institution;
}

const DeleteInstitution = ({ institution }: DeleteInstitutionProps) => {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleDelete(institutionId: number) {
    setIsMutating(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${apiUrl}/api/v1/institutes/${institutionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete institution");
      }

      setIsMutating(false);
      alert("Institution deleted successfully");
      router.refresh();
      setModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to delete institution");
      setIsMutating(false);
    }
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      {/* Button to open modal */}
      <Button className="bg-red-500 hover:bg-red-700" onClick={handleChange}>Delete</Button>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            {/* Modal content */}
            <h2 className="text-2xl mb-4 text-center">
            Are you sure you want to delete <strong>{institution.name}</strong>?
            </h2>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleChange}
                className="bg-gray-500 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(institution.id)}
                className={`${
                  isMutating ? "bg-gray-400" : "bg-red-500 hover:bg-red-700"
                } text-white`}
                disabled={isMutating}
              >
                {isMutating ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteInstitution;
