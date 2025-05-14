"use client";

import { useState, useEffect, useRef } from "react";
import AdminNavbar from "@/components/admin/admin-navbar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadImagesToCloudinary } from "@/utils/cloudiary";
import { Loader2 } from "lucide-react";
import useAdmin from "@/hooks/useAdmin";
import {
  NewUserAdminRequest,
  UpdateUserAdminRequest,
} from "@/services/adminService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 25;

const userEditFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string().optional(),
  roles: z.array(z.string()).min(1, "At least one role must be selected"),
});

const userAddFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string().optional(),
  roles: z.array(z.string()).min(1, "At least one role must be selected"),
});

export default function AdminUser() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [editProfileImage, setEditProfileImage] = useState<File | null>(null);
  const [editProfileImagePreview, setEditProfileImagePreview] = useState<
    string | null
  >(null);
  const [addProfileImage, setAddProfileImage] = useState<File | null>(null);
  const [addProfileImagePreview, setAddProfileImagePreview] = useState<
    string | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    loading,
    error,
    users,
    searchResults,
    addNewUser,
    updateUser,
    toggleUserStatus,
    fetchUsers,
    searchUsers,
  } = useAdmin();

  const editFileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const editForm = useForm<z.infer<typeof userEditFormSchema>>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "MALE" as const,
      dateOfBirth: undefined,
      roles: ["ROLE_USER"],
    },
  });

  const addForm = useForm<z.infer<typeof userAddFormSchema>>({
    resolver: zodResolver(userAddFormSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      gender: "MALE" as const,
      dateOfBirth: undefined,
      roles: ["ROLE_USER"],
    },
  });

  const [hasEditFormChanges, setHasEditFormChanges] = useState(false);
  const [hasAddFormChanges, setHasAddFormChanges] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (editUser) {
      editForm.reset({
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        gender: editUser.gender as "MALE" | "FEMALE",
        dateOfBirth: editUser.dateOfBirth || undefined,
        roles: editUser.roles.map((role) => role.name),
      });

      setEditProfileImagePreview(editUser.profilePictureUrl || null);
      setEditProfileImage(null);

      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }

      setHasEditFormChanges(false);
    }
  }, [editUser, editForm]);

  // Track edit form changes
  useEffect(() => {
    const subscription = editForm.watch(() => setHasEditFormChanges(true));
    return () => subscription.unsubscribe();
  }, [editForm]);

  // Track add form changes
  useEffect(() => {
    const subscription = addForm.watch(() => setHasAddFormChanges(true));
    return () => subscription.unsubscribe();
  }, [addForm]);

  useEffect(() => {
    if (showAddDialog) {
      addForm.reset({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        gender: "MALE" as const,
        dateOfBirth: undefined,
        roles: ["ROLE_USER"],
      });

      // Reset profile image state
      setAddProfileImage(null);
      setAddProfileImagePreview(null);

      if (addFileInputRef.current) {
        addFileInputRef.current.value = "";
      }

      setHasAddFormChanges(false);
    }
  }, [showAddDialog, addForm]);

  // Handle file selection for edit form
  const handleEditProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setEditProfileImage(file);
      setEditProfileImagePreview(URL.createObjectURL(file));
      setHasEditFormChanges(true);
    }
  };

  // Handle file selection for add form
  const handleAddProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAddProfileImage(file);
      setAddProfileImagePreview(URL.createObjectURL(file));
      setHasAddFormChanges(true);
    }
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      const userData = (
        searchKeyword ? searchResults?.content : users?.content
      )?.find((user) => user.id === selectedIds[0]);
      if (userData) {
        setEditUser(userData);
        setShowEditDialog(true);
      }
    } else {
      alert("Vui lòng chọn đúng 1 người dùng để sửa.");
    }
  };

  const handleDelete = () => {
    if (selectedIds.length > 0) {
      setShowConfirmDialog(true);
    } else {
      alert("Vui lòng chọn ít nhất 1 người dùng.");
    }
  };

  const handleAdd = () => {
    setShowAddDialog(true);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim()) {
      searchUsers(keyword);
    } else {
      fetchUsers();
    }
  };

  // Get current users list based on search status
  const currentUsers = searchKeyword ? searchResults : users;
  const usersList = currentUsers?.content || [];
  const totalPages = currentUsers?.totalPages || 1;

  // Toggle user selection
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSelected = (id: number) => selectedIds.includes(id);
  const selectedUsers = usersList.filter((u) => selectedIds.includes(u.id));

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (searchKeyword) {
      searchUsers(searchKeyword, newPage);
    } else {
      fetchUsers(newPage);
    }
  };

  const onSubmitEdit = async (values: z.infer<typeof userEditFormSchema>) => {
    if (!editUser) return;

    try {
      setIsUploading(true);
      let profilePictureUrl: string | undefined = editUser.profilePictureUrl ? editUser.profilePictureUrl : undefined;

      // Upload profile image if a new one is selected
      if (editProfileImage) {
        const uploadedUrls = await uploadImagesToCloudinary([editProfileImage]);
        if (uploadedUrls.length > 0) {
          profilePictureUrl = uploadedUrls[0];
        }
      }

      const userData: UpdateUserAdminRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        roles: values.roles,
        profilePictureUrl,
      };

      const success = await updateUser(editUser.id, userData);
      if (success) {
        setShowEditDialog(false);
        setHasEditFormChanges(false);
        if (searchKeyword) {
          searchUsers(searchKeyword, currentPage);
        } else {
          fetchUsers(currentPage);
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmitAdd = async (values: z.infer<typeof userAddFormSchema>) => {
    try {
      setIsUploading(true);
      let profilePictureUrl: string | undefined = undefined;

      // Upload profile image if selected
      if (addProfileImage) {
        const uploadedUrls = await uploadImagesToCloudinary([addProfileImage]);
        if (uploadedUrls.length > 0) {
          profilePictureUrl = uploadedUrls[0];
        }
      }

      const userData: NewUserAdminRequest = {
        username: values.username,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth || "",
        profilePictureUrl,
        roles: values.roles,
      };

      const success = await addNewUser(userData);
      if (success) {
        setShowAddDialog(false);
        setHasAddFormChanges(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    try {
      let successCount = 0;

      for (const userId of selectedIds) {
        const success = await toggleUserStatus(userId);
        if (success) successCount++;
      }

      if (successCount > 0) {
        alert(`Đã khóa/mở khóa thành công ${successCount} người dùng.`);
        setSelectedIds([]);
        if (searchKeyword) {
          searchUsers(searchKeyword, currentPage);
        } else {
          fetchUsers(currentPage);
        }
      }

      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error deactivating users:", error);
    }
  };

  return (
    <>
      <AdminNavbar
        title="Quản lý người dùng"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        selectedCount={selectedIds.length}
        searchPlaceholder="Tìm kiếm người dùng..."
      />
      <div className="w-full space-y-4 p-2">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="overflow-x-auto rounded-md border text-sm shadow-sm">
          {loading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={
                        usersList.every((u) => selectedIds.includes(u.id)) &&
                        usersList.length > 0
                      }
                      onCheckedChange={(checked) =>
                        setSelectedIds((prev) => {
                          const currentIds = usersList.map((u) => u.id);
                          return checked
                            ? Array.from(new Set([...prev, ...currentIds]))
                            : prev.filter((id) => !currentIds.includes(id));
                        })
                      }
                    />
                  </th>
                  <th className="p-3 text-left text-nowrap">ID</th>
                  <th className="p-3 text-left text-nowrap">Ảnh đại diện</th>
                  <th className="p-3 text-left text-nowrap">Tên đăng nhập</th>
                  <th className="p-3 text-left text-nowrap">Tên</th>
                  <th className="p-3 text-left text-nowrap">Email</th>
                  <th className="p-3 text-left text-nowrap">Giới tính</th>
                  <th className="p-3 text-left text-nowrap">Ngày sinh</th>
                  <th className="p-3 text-left text-nowrap">Vai trò</th>
                  <th className="p-3 text-left text-nowrap">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-5 text-center text-gray-500">
                      {searchKeyword
                        ? "Không tìm thấy người dùng phù hợp."
                        : "Không có dữ liệu người dùng."}
                    </td>
                  </tr>
                ) : (
                  usersList.map((user) => (
                    <tr
                      key={user.id}
                      className={isSelected(user.id) ? "bg-blue-50" : ""}
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={isSelected(user.id)}
                          onCheckedChange={() => toggleSelect(user.id)}
                        />
                      </td>
                      <td className="p-3 text-nowrap">{user.id}</td>
                      <td className="p-3">
                        {user.profilePictureUrl ? (
                          <img
                            src={user.profilePictureUrl}
                            alt={user.firstName}
                            width={40}
                            height={40}
                            className="size-10 rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm text-white">
                            {user.firstName[0].toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="p-3">{user.username}</td>
                      <td className="p-3 text-nowrap">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.gender === "MALE" ? "Nam" : "Nữ"}</td>
                      <td className="p-3">
                        {user.dateOfBirth
                          ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                          : "Chưa có"}
                      </td>
                      <td className="p-3">
                        {user.roles.map((role) => role.name).join(", ")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Phân trang */}
        {!loading && usersList.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-muted-foreground text-sm">
              Trang {currentPage + 1} / {totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0 || loading}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handlePageChange(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1 || loading}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Improved Edit User Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          if (!open && hasEditFormChanges) {
            // Ask for confirmation when closing with unsaved changes
            if (
              confirm(
                "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đóng không?",
              )
            ) {
              setShowEditDialog(false);
            }
          } else {
            setShowEditDialog(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Sửa người dùng
            </DialogTitle>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onSubmitEdit)}
              className="space-y-4"
            >
              {/* Profile Picture Section */}
              <FormItem>
                <FormLabel>Ảnh đại diện</FormLabel>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                    {editProfileImagePreview ? (
                      <img
                        src={editProfileImagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-semibold text-gray-400">
                        {editUser?.firstName?.[0] || "?"}
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <input
                      type="file"
                      id="edit-profile-image"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={handleEditProfileImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full"
                    >
                      Chọn ảnh
                    </Button>
                    {editProfileImage && (
                      <p className="text-xs text-gray-500">
                        {editProfileImage.name} (
                        {Math.round(editProfileImage.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>
              </FormItem>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-role-user"
                          checked={editForm
                            .watch("roles")
                            .includes("ROLE_USER")}
                          onCheckedChange={(checked) => {
                            const currentRoles = editForm.getValues("roles");
                            if (checked) {
                              editForm.setValue(
                                "roles",
                                [...currentRoles, "ROLE_USER"],
                                {
                                  shouldValidate: true,
                                },
                              );
                            } else {
                              editForm.setValue(
                                "roles",
                                currentRoles.filter(
                                  (role) => role !== "ROLE_USER",
                                ),
                                { shouldValidate: true },
                              );
                            }
                          }}
                        />
                        <Label htmlFor="edit-role-user">User</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-role-admin"
                          checked={editForm
                            .watch("roles")
                            .includes("ROLE_ADMIN")}
                          onCheckedChange={(checked) => {
                            const currentRoles = editForm.getValues("roles");
                            if (checked) {
                              editForm.setValue(
                                "roles",
                                [...currentRoles, "ROLE_ADMIN"],
                                {
                                  shouldValidate: true,
                                },
                              );
                            } else {
                              editForm.setValue(
                                "roles",
                                currentRoles.filter(
                                  (role) => role !== "ROLE_ADMIN",
                                ),
                                { shouldValidate: true },
                              );
                            }
                          }}
                        />
                        <Label htmlFor="edit-role-admin">Admin</Label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (
                      !hasEditFormChanges ||
                      confirm("Bạn có chắc chắn muốn hủy các thay đổi?")
                    ) {
                      setShowEditDialog(false);
                    }
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isUploading || loading}>
                  {isUploading || loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    "Lưu"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete/Lock */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận khóa/mở khóa người dùng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Bạn có chắc chắn muốn khóa/mở khóa {selectedUsers.length} người
              dùng này không?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeactivate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Improved Add User Dialog */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          if (!open && hasAddFormChanges) {
            if (
              confirm(
                "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đóng không?",
              )
            ) {
              setShowAddDialog(false);
            }
          } else {
            setShowAddDialog(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Thêm người dùng mới
            </DialogTitle>
          </DialogHeader>

          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(onSubmitAdd)}
              className="space-y-4"
            >
              {/* Profile Picture Section */}
              <FormItem>
                <FormLabel>Ảnh đại diện</FormLabel>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                    {addProfileImagePreview ? (
                      <img
                        src={addProfileImagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-semibold text-gray-400">
                        ?
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <input
                      type="file"
                      id="add-profile-image"
                      ref={addFileInputRef}
                      accept="image/*"
                      onChange={handleAddProfileImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addFileInputRef.current?.click()}
                      className="w-full"
                    >
                      Chọn ảnh
                    </Button>
                    {addProfileImage && (
                      <p className="text-xs text-gray-500">
                        {addProfileImage.name} (
                        {Math.round(addProfileImage.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>
              </FormItem>

              <FormField
                control={addForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="add-role-user"
                          checked={addForm.watch("roles").includes("ROLE_USER")}
                          onCheckedChange={(checked) => {
                            const currentRoles = addForm.getValues("roles");
                            if (checked) {
                              addForm.setValue(
                                "roles",
                                [...currentRoles, "ROLE_USER"],
                                {
                                  shouldValidate: true,
                                },
                              );
                            } else {
                              addForm.setValue(
                                "roles",
                                currentRoles.filter(
                                  (role) => role !== "ROLE_USER",
                                ),
                                { shouldValidate: true },
                              );
                            }
                          }}
                        />
                        <Label htmlFor="add-role-user">User</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="add-role-admin"
                          checked={addForm
                            .watch("roles")
                            .includes("ROLE_ADMIN")}
                          onCheckedChange={(checked) => {
                            const currentRoles = addForm.getValues("roles");
                            if (checked) {
                              addForm.setValue(
                                "roles",
                                [...currentRoles, "ROLE_ADMIN"],
                                {
                                  shouldValidate: true,
                                },
                              );
                            } else {
                              addForm.setValue(
                                "roles",
                                currentRoles.filter(
                                  (role) => role !== "ROLE_ADMIN",
                                ),
                                { shouldValidate: true },
                              );
                            }
                          }}
                        />
                        <Label htmlFor="add-role-admin">Admin</Label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (
                      !hasAddFormChanges ||
                      confirm("Bạn có chắc chắn muốn hủy các thay đổi?")
                    ) {
                      setShowAddDialog(false);
                    }
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isUploading || loading}>
                  {isUploading || loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    "Thêm"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
