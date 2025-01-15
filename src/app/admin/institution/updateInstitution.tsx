import { useState, SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getToken from "@/lib/getToken";
import { X } from "lucide-react";

import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/env";

interface Institution {
  id: number;
  name: string;
}

const UpdateInstitution = ({ institution }: { institution: Institution }) => {
  const [name, setName] = useState(institution.name || "");
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setIsMutating(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${apiUrl}/api/v1/institutes/${institution.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update institution");
      }

      setIsMutating(false);
      router.refresh();
      setModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update institution");
      setIsMutating(false);
    }
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      {/* Button to open modal */}
      <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleChange}>Edit</Button>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={handleChange}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal content */}
            <h2 className="text-2xl font-bold mb-4">Edit Institution</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Institution Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Institution Name"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <Button type="submit" disabled={isMutating} className="mt-5">
                    {isMutating ? "Saving..." : "Update Institution"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateInstitution;
