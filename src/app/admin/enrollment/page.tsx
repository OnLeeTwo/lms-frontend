"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Filter, MoreHorizontal, Pencil, Trash, Plus } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

const enrollmentData = [
  {
    id: 1,
    studentId: "S001",
    name: "Budi Supra",
    email: "test@example2.com",
    role: "Student",
    institute: "Revou FSSE",
    enrollmentDate: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    studentId: "I001",
    name: "John Pork",
    email: "test@example1.com",
    role: "Instructor",
    institute: "Revou FSSE",
    enrollmentDate: "2024-02-01",
    status: "Active",
  },
  {
    id: 3,
    studentId: "S002",
    name: "Andi Kuas",
    email: "test@example3.com",
    role: "Student",
    institute: "Udemy",
    enrollmentDate: "2024-01-20",
    status: "Pending",
  },
];

const EnrollmentPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState(enrollmentData);
  const [filteredEnrollments, setFilteredEnrollments] =
    useState(enrollmentData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [isEnrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState<any>(null);

  // New state for enrollment form
  const [newEnrollmentName, setNewEnrollmentName] = useState("");
  const [newEnrollmentEmail, setNewEnrollmentEmail] = useState("");
  const [newEnrollmentRole, setNewEnrollmentRole] = useState("Student");
  const [newEnrollmentInstitute, setnewEnrollmentInstitute] = useState("");

  useEffect(() => {
    let result = enrollments;

    if (searchTerm) {
      result = result.filter(
        (enrollment) =>
          enrollment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      result = result.filter(
        (enrollment) => enrollment.status === filterStatus
      );
    }

    if (filterRole) {
      result = result.filter((enrollment) => enrollment.role === filterRole);
    }

    setFilteredEnrollments(result);
  }, [searchTerm, filterStatus, filterRole, enrollments]);

  const handleEnroll = () => {
    const newEnrollment = {
      id: enrollments.length + 1,
      studentId: `${newEnrollmentRole === "Student" ? "S" : "I"}${
        enrollments.length + 1
      }`,
      name: newEnrollmentName,
      email: newEnrollmentEmail,
      role: newEnrollmentRole,
      institute: newEnrollmentInstitute,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "Active",
    };

    setEnrollments((prev) => [...prev, newEnrollment]);

    toast({
      title: "Enrollment Successful",
      description: `${newEnrollmentName} has been enrolled as a ${newEnrollmentRole}`,
      className: "bg-green-400",
    });

    // Reset form
    setNewEnrollmentName("");
    setNewEnrollmentEmail("");
    setNewEnrollmentRole("Student");
    setnewEnrollmentInstitute("");
    setEnrollDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedEnrollments = enrollments.filter((e) => e.id !== id);
    setEnrollments(updatedEnrollments);

    toast({
      title: "Enrollment Removed",
      description: "The enrollment has been deleted",
      className: "bg-red-400",
    });
  };

  const handleEdit = () => {
    const updatedEnrollments = enrollments.map((e) =>
      e.id === currentEnrollment.id ? { ...currentEnrollment } : e
    );

    setEnrollments(updatedEnrollments);

    toast({
      title: "Enrollment Updated",
      description: `${currentEnrollment.name}'s details have been modified`,
      className: "bg-blue-400",
    });

    setEditDialogOpen(false);
  };

  return (
    <div className="flex flex-row">
      <Sidebar role="admin" />
      <div className="flex w-full justify-center">
        <Card className="flex flex-col w-3/4 mx-10 my-8">
          <CardHeader>
            <CardTitle>Enrollment Management</CardTitle>
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search by name, email, or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">All Roles</option>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>
              <Dialog
                open={isEnrollDialogOpen}
                onOpenChange={setEnrollDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2" /> Enroll
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enroll New Participant</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Name</Label>
                      <Input
                        value={newEnrollmentName}
                        onChange={(e) => setNewEnrollmentName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Email</Label>
                      <Input
                        value={newEnrollmentEmail}
                        onChange={(e) => setNewEnrollmentEmail(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Role</Label>
                      <select
                        value={newEnrollmentRole}
                        onChange={(e) => setNewEnrollmentRole(e.target.value)}
                        className="col-span-3 border rounded p-2"
                      >
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Institute</Label>
                      <Input
                        value={newEnrollmentInstitute}
                        onChange={(e) =>
                          setnewEnrollmentInstitute(e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleEnroll}
                      disabled={!newEnrollmentName || !newEnrollmentEmail}
                    >
                      Enroll
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Institute</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.studentId}</TableCell>
                    <TableCell>{enrollment.name}</TableCell>
                    <TableCell>{enrollment.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded ${
                          enrollment.role === "Student"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {enrollment.role}
                      </span>
                    </TableCell>
                    <TableCell>{enrollment.institute}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded ${
                          enrollment.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentEnrollment(enrollment);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(enrollment.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Enrollment</DialogTitle>
            </DialogHeader>
            {currentEnrollment && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Name</Label>
                  <Input
                    value={currentEnrollment.name}
                    onChange={(e) =>
                      setCurrentEnrollment({
                        ...currentEnrollment,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email</Label>
                  <Input
                    value={currentEnrollment.email}
                    onChange={(e) =>
                      setCurrentEnrollment({
                        ...currentEnrollment,
                        email: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Role</Label>
                  <select
                    value={currentEnrollment.role}
                    onChange={(e) =>
                      setCurrentEnrollment({
                        ...currentEnrollment,
                        role: e.target.value,
                      })
                    }
                    className="col-span-3 border rounded p-2"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Institute</Label>
                  <Input
                    value={currentEnrollment.Institute}
                    onChange={(e) =>
                      setCurrentEnrollment({
                        ...currentEnrollment,
                        Institute: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EnrollmentPage;
