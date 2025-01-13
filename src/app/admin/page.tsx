"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"; // Assuming your custom hook is stored here
import { Plus, Trash } from "lucide-react";
import SwitchUser from "@/components/SwitchUser"; // Importing SwitchUser
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  TableHead,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

const accountData = [
  {
    id: 1,
    email: "test@example.com",
    name: "Owent Ovandy",
    role: "Admin",
  },
  {
    id: 2,
    email: "test@example1.com",
    name: "John Pork",
    role: "Instructor",
  },
  {
    id: 3,
    email: "test@example2.com",
    name: "Budi Supra",
    role: "Student",
  },
];

const AdminPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState(accountData);
  const [filteredUsers, setFilteredUsers] = useState(accountData);
  const [paginationPage, setPaginationPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [filterRole, setFilterRole] = useState("");
  const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<number | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Instructor");
  const [loading, setLoading] = useState(false);

  // State for SwitchUser functionality
  const [userData, setUserData] = useState<any | null>(null);
  const [selectedInstituteId, setSelectedInstituteId] = useState<number>(1); // Track selected institute ID
  const [currentRole, setCurrentRole] = useState("Admin");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setCurrentRole(parsedUserData?.role || "Admin");
    }
  }, []);

  const handleAddUser = async () => {
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        email: newUserEmail,
        name: newUserName,
        role: newUserRole,
      };
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers, newUser];
        setFilteredUsers(updatedUsers);
        return updatedUsers;
      });

      toast({
        title: "User Added Successfully",
        description: `New user ${newUserName} was added.`,
        className: "bg-green-400",
        duration: 1500,
      });

      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("Admin");
      setRemoveDialogOpen(false);
      setLoading(false);
    }, 2000);
  };

  const handleRemoveUser = async (userId: number) => {
    setLoading(true);
    setTimeout(() => {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.id !== userId);
        setFilteredUsers(updatedUsers);
        return updatedUsers;
      });
      toast({
        title: "User Removed",
        description: `User with ID ${userId} was removed.`,
        className: "bg-red-400",
        duration: 1500,
      });
      setRemoveDialogOpen(false);
      setLoading(false);
    }, 2000);
  };

  // Handle institute/role switching from SwitchUser
  const handleInstituteChange = (instituteId: number) => {
    setSelectedInstituteId(instituteId);
    // Optionally, update the current role if needed
    const selectedRole =
      userData?.roles.find((role: any) => role.institute_id === instituteId)
        ?.role || "Student";
    setCurrentRole(selectedRole);
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="flex flex-col w-1/2 mx-10 my-8 justify-center items-center">
        <CardHeader className="w-full text-center">
          <CardTitle>
            Participants
            {/* SwitchUser */}
            {userData && (
              <SwitchUser
                roles={userData.roles || []}
                onInstituteChange={handleInstituteChange}
              />
            )}
          </CardTitle>
          <div className="flex justify-end gap-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-1/6">
                  <Plus /> Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add a user</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter an email"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="username"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <select
                      id="role"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="col-span-3 border rounded p-2"
                    >
                      <option value="Instructor">Instructor</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddUser}
                    disabled={!newUserName || !newUserEmail || loading}
                  >
                    {loading ? "Adding..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant={"outline"} className="w-1/12">
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/6">Email</TableHead>
                <TableHead className="w-2/6">Role</TableHead>
                <TableHead className="w-2/6">Name</TableHead>
                <TableHead className="w-1/6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setUserToRemove(account.id);
                        setRemoveDialogOpen(true);
                      }}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              router.push("/courses");
            }}
          >
            Back
          </Button>
        </CardFooter>
      </Card>

      {/* Remove User Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to remove this user?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (userToRemove !== null) {
                  handleRemoveUser(userToRemove);
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
