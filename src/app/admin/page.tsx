"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Plus, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const accountData = [
  {
    id: 1,
    email: "admin@revou.com",
    role: "Admin",
  },
  {
    id: 2,
    email: "student@revou.com",
    role: "Student",
  },
  {
    id: 3,
    email: "student2@revou.com",
    role: "Student",
  },
];

const submitForm = () => {};

const AdminPage = () => {
  return (
    <div className="flex w-full justify-center">
      <Card className="flex flex-col w-1/2 mx-10 my-8 justify-center items-center">
        <CardHeader className="w-full text-center">
          <h1 className="font-bold">Participants</h1>
          <div className="flex justify-end gap-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-1/6">
                  <Plus /> Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite an email to this institution</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="name"
                      defaultValue=""
                      className="col-span-3"
                      placeholder="Enter an email"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant={"outline"} className="w-1/12">
              <ListFilter />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-4/6">Email</TableHead>
                <TableHead className="w-2/6">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountData.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.email}</TableCell>
                  <TableCell>{account.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-5">
          <Pagination className="">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Button>Dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPage;
