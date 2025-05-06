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
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Post, PostRequest } from "@/types/Post";
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
// import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadImagesToCloudinary } from "@/utils/cloudiary";
import { Loader2, Image, Film } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import usePost from "@/hooks/usePost";
import { toast } from "sonner";

const PAGE_SIZE = 10;

// Schema for editing posts
const postEditFormSchema = z.object({
  content: z.string().min(1, "Nội dung bài viết không được để trống"),
  viewer: z.enum(["PUBLIC", "PRIVATE", "FRIENDS"]),
});

// Schema for adding new posts
const postAddFormSchema = z.object({
  content: z.string().min(1, "Nội dung bài viết không được để trống"),
  viewer: z.enum(["PUBLIC", "PRIVATE", "FRIENDS"]),
});

export default function AdminPost() {
  // const { toast } = useToast();
  const {
    loading,
    error,
    posts,
    createPost,
    deletePost,
    updatePost,
    searchPosts,
    fetchPostById,
  } = usePost();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  // Media files
  const [editMedia, setEditMedia] = useState<File[]>([]);
  const [editMediaPreviews, setEditMediaPreviews] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [addMedia, setAddMedia] = useState<File[]>([]);
  const [addMediaPreviews, setAddMediaPreviews] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  const editFileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const editForm = useForm<z.infer<typeof postEditFormSchema>>({
    resolver: zodResolver(postEditFormSchema),
    defaultValues: {
      content: "",
      viewer: "PUBLIC",
    },
  });

  const addForm = useForm<z.infer<typeof postAddFormSchema>>({
    resolver: zodResolver(postAddFormSchema),
    defaultValues: {
      content: "",
      viewer: "PUBLIC",
    },
  });

  const [hasEditFormChanges, setHasEditFormChanges] = useState(false);
  const [hasAddFormChanges, setHasAddFormChanges] = useState(false);

  // Fetch all posts on mount and when page changes
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        // In a real implementation, you would have a method to fetch posts with pagination
        // For now, we'll just use the posts returned by usePost and implement client-side pagination

        // This would ideally be a separate admin API call with pagination support
        // const response = await fetch(`/api/admin/posts?page=${currentPage}&size=${PAGE_SIZE}`);
        // const data = await response.json();

        if (posts) {
          setAllPosts(posts);
          setTotalPages(Math.ceil(posts.length / PAGE_SIZE));
        }
      } catch (error) {
        toast.error("Failed to fetch posts. Please try again.");
      }
    };

    fetchAllPosts();
  }, [posts, currentPage, toast]);

  useEffect(() => {
    if (editPost) {
      editForm.reset({
        content: editPost.content,
        viewer: editPost.viewer as "PUBLIC" | "PRIVATE" | "FRIENDS",
      });

      // Set media previews from existing post
      setEditMediaPreviews(editPost.multiFile || []);
      setEditMedia([]);

      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }

      setHasEditFormChanges(false);
    }
  }, [editPost, editForm]);

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
        content: "",
        viewer: "PUBLIC",
      });

      // Reset media state
      setAddMedia([]);
      setAddMediaPreviews([]);

      if (addFileInputRef.current) {
        addFileInputRef.current.value = "";
      }

      setHasAddFormChanges(false);
    }
  }, [showAddDialog, addForm]);

  // Handle file selection for edit form
  const handleEditMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setEditMedia([...editMedia, ...newFiles]);

      // Create previews
      const newPreviews = newFiles.map((file) => {
        const isVideo = file.type.startsWith("video/");
        return {
          url: URL.createObjectURL(file),
          type: isVideo ? ("video" as const) : ("image" as const),
        };
      });

      setEditMediaPreviews([...editMediaPreviews, ...newPreviews]);
      setHasEditFormChanges(true);
    }
  };

  // Handle file selection for add form
  const handleAddMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAddMedia([...addMedia, ...newFiles]);

      // Create previews
      const newPreviews = newFiles.map((file) => {
        const isVideo = file.type.startsWith("video/");
        return {
          url: URL.createObjectURL(file),
          type: isVideo ? ("video" as const) : ("image" as const),
        };
      });

      setAddMediaPreviews([...addMediaPreviews, ...newPreviews]);
      setHasAddFormChanges(true);
    }
  };

  // Remove media preview
  const removeEditMediaPreview = (index: number) => {
    // For existing media from the post
    if (index < (editPost?.multiFile?.length || 0)) {
      setEditMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    }
    // For newly added media
    else {
      const adjustedIndex = index - (editPost?.multiFile?.length || 0);
      setEditMedia((prev) => prev.filter((_, i) => i !== adjustedIndex));
      setEditMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    }
    setHasEditFormChanges(true);
  };

  const removeAddMediaPreview = (index: number) => {
    setAddMedia((prev) => prev.filter((_, i) => i !== index));
    setAddMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setHasAddFormChanges(true);
  };

  const handleEdit = async () => {
    if (selectedIds.length === 1) {
      try {
        const post = await fetchPostById(selectedIds[0]);
        if (post) {
          setEditPost(post);
          setShowEditDialog(true);
        }
      } catch (error) {
        toast.error("Failed to fetch post details");
      }
    } else {
      toast.message("Selection required");
    }
  };

  const handleDelete = () => {
    if (selectedIds.length > 0) {
      setShowConfirmDialog(true);
    } else {
      toast.message(
        "Vui lòng chọn ít nhất 1 bài viết.",
      );
    }
  };

  const handleAdd = () => {
    setShowAddDialog(true);
  };

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim()) {
      const results = await searchPosts(keyword);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Get current posts list based on search status and pagination
  const currentPosts = searchKeyword ? searchResults : allPosts;
  const paginatedPosts = currentPosts.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );
  const maxPages = Math.ceil(currentPosts.length / PAGE_SIZE) || 1;

  // Toggle post selection
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSelected = (id: number) => selectedIds.includes(id);
  const selectedPosts = paginatedPosts.filter((p) =>
    selectedIds.includes(p.postId),
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onSubmitEdit = async (values: z.infer<typeof postEditFormSchema>) => {
    if (!editPost) return;

    try {
      setIsUploading(true);
      let mediaUrls: { url: string; type: "image" | "video" }[] = [];

      // Keep existing media files that weren't removed
      editMediaPreviews.forEach((media) => {
        // If it's an existing media (not a newly added one with object URL)
        if (!media.url.startsWith("blob:")) {
          mediaUrls.push(media);
        }
      });

      // Upload new media files
      if (editMedia.length > 0) {
        const imageFiles = editMedia.filter((file) =>
          file.type.startsWith("image/"),
        );
        const videoFiles = editMedia.filter((file) =>
          file.type.startsWith("video/"),
        );

        if (imageFiles.length > 0) {
          const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);
          uploadedImageUrls.forEach((url) => {
            mediaUrls.push({ url, type: "image" });
          });
        }

        // For video uploads, you would need a similar service for videos
        // This is a placeholder for where you would handle video uploads
        if (videoFiles.length > 0) {
          // Example video upload implementation would go here
          toast({
            title: "Video upload",
            description: "Video upload functionality would be implemented here",
          });
        }
      }

      const postData: PostRequest = {
        content: values.content,
        viewer: values.viewer,
        multiFile: mediaUrls,
      };

      const updatedPost = await updatePost(editPost.postId, postData);
      if (updatedPost) {
        toast({
          title: "Success",
          description: "Bài viết đã được cập nhật thành công",
        });
        setShowEditDialog(false);
        setHasEditFormChanges(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmitAdd = async (values: z.infer<typeof postAddFormSchema>) => {
    try {
      setIsUploading(true);
      let mediaUrls: { url: string; type: "image" | "video" }[] = [];

      // Upload media files
      if (addMedia.length > 0) {
        const imageFiles = addMedia.filter((file) =>
          file.type.startsWith("image/"),
        );
        const videoFiles = addMedia.filter((file) =>
          file.type.startsWith("video/"),
        );

        if (imageFiles.length > 0) {
          const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);
          uploadedImageUrls.forEach((url) => {
            mediaUrls.push({ url, type: "image" });
          });
        }

        // For video uploads, you would need a similar service for videos
        if (videoFiles.length > 0) {
          // Example video upload implementation would go here
          toast({
            title: "Video upload",
            description: "Video upload functionality would be implemented here",
          });
        }
      }

      const postData: PostRequest = {
        content: values.content,
        viewer: values.viewer,
        multiFile: mediaUrls,
      };

      const newPost = await createPost(postData);
      if (newPost) {
        toast({
          title: "Success",
          description: "Bài viết mới đã được tạo thành công",
        });
        setShowAddDialog(false);
        setHasAddFormChanges(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      let successCount = 0;

      for (const postId of selectedIds) {
        try {
          await deletePost(postId);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete post ${postId}:`, error);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `Đã xóa thành công ${successCount} bài viết.`,
        });
        setSelectedIds([]);
      }

      setShowConfirmDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const viewerLabels = {
    PUBLIC: "Công khai",
    FRIENDS: "Bạn bè",
    PRIVATE: "Riêng tư",
  };

  const viewerStyles = {
    PUBLIC: "bg-green-100 text-green-800",
    FRIENDS: "bg-blue-100 text-blue-800",
    PRIVATE: "bg-gray-100 text-gray-800",
  };

  return (
    <>
      <AdminNavbar
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />
      <div className="w-full space-y-4 p-2">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="overflow-x-auto rounded-md border text-sm shadow-sm">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p>Đang tải dữ liệu bài viết...</p>
            </div>
          ) : (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={
                        paginatedPosts.every((p) =>
                          selectedIds.includes(p.postId),
                        ) && paginatedPosts.length > 0
                      }
                      onCheckedChange={(checked) =>
                        setSelectedIds((prev) => {
                          const currentIds = paginatedPosts.map(
                            (p) => p.postId,
                          );
                          return checked
                            ? Array.from(new Set([...prev, ...currentIds]))
                            : prev.filter((id) => !currentIds.includes(id));
                        })
                      }
                    />
                  </th>
                  <th className="p-3 text-left text-nowrap">ID</th>
                  <th className="p-3 text-left text-nowrap">Nội dung</th>
                  <th className="p-3 text-left text-nowrap">Ảnh/Video</th>
                  <th className="p-3 text-left text-nowrap">Tác giả</th>
                  <th className="p-3 text-left text-nowrap">Thời gian</th>
                  <th className="p-3 text-left text-nowrap">Lượt thích</th>
                  <th className="p-3 text-left text-nowrap">Bình luận</th>
                  <th className="p-3 text-left text-nowrap">Chia sẻ</th>
                  <th className="p-3 text-left text-nowrap">Chế độ</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-5 text-center text-gray-500">
                      {searchKeyword
                        ? "Không tìm thấy bài viết phù hợp."
                        : "Không có dữ liệu bài viết."}
                    </td>
                  </tr>
                ) : (
                  paginatedPosts.map((post) => (
                    <tr
                      key={post.postId}
                      className={isSelected(post.postId) ? "bg-blue-50" : ""}
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={isSelected(post.postId)}
                          onCheckedChange={() => toggleSelect(post.postId)}
                        />
                      </td>
                      <td className="p-3">{post.postId}</td>
                      <td className="p-3">
                        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {post.content}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {post.multiFile?.map((file, index) => (
                            <div
                              key={index}
                              className="flex h-10 w-10 items-center justify-center rounded bg-gray-200"
                              title={
                                file.type === "image" ? "Hình ảnh" : "Video"
                              }
                            >
                              {file.type === "image" ? (
                                <Image className="h-6 w-6 text-gray-500" />
                              ) : (
                                <Film className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                          ))}
                          {!post.multiFile?.length && (
                            <span className="text-gray-500">Không có</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {post.author.profilePictureUrl ? (
                            <img
                              src={post.author.profilePictureUrl}
                              alt={post.author.firstName}
                              className="h-6 w-6 rounded-full"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs text-white">
                              {post.author.firstName[0].toUpperCase()}
                            </div>
                          )}
                          <span>{post.author.username}</span>
                        </div>
                      </td>
                      <td className="p-3 text-nowrap">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="p-3">{post.likes}</td>
                      <td className="p-3">{post.comments}</td>
                      <td className="p-3">{post.shares}</td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            viewerStyles[
                              post.viewer as keyof typeof viewerStyles
                            ]
                          }`}
                        >
                          {
                            viewerLabels[
                              post.viewer as keyof typeof viewerLabels
                            ]
                          }
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
        {!loading && paginatedPosts.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-muted-foreground text-sm">
              Trang {currentPage + 1} / {maxPages}
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
                  handlePageChange(Math.min(maxPages - 1, currentPage + 1))
                }
                disabled={currentPage === maxPages - 1 || loading}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Post Dialog */}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Chỉnh sửa bài viết
            </DialogTitle>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onSubmitEdit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung bài viết..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="viewer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chế độ hiển thị</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chế độ hiển thị" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Công khai</SelectItem>
                        <SelectItem value="FRIENDS">Bạn bè</SelectItem>
                        <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media Section */}
              <FormItem>
                <FormLabel>Hình ảnh & Video</FormLabel>
                <div className="space-y-4">
                  {/* Current media previews */}
                  {editMediaPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {editMediaPreviews.map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === "image" ? (
                            <img
                              src={media.url}
                              alt={`Media ${index}`}
                              className="h-24 w-full rounded object-cover"
                            />
                          ) : (
                            <div className="relative flex h-24 w-full items-center justify-center rounded bg-gray-200">
                              <Film className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeEditMediaPreview(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <div className="flex w-full flex-col gap-2">
                    <input
                      type="file"
                      id="edit-media"
                      ref={editFileInputRef}
                      accept="image/*,video/*"
                      onChange={handleEditMediaChange}
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full"
                    >
                      Chọn ảnh hoặc video
                    </Button>
                  </div>
                </div>
              </FormItem>

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

      {/* Confirmation Dialog for Delete */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Bạn có chắc chắn muốn xóa {selectedIds.length} bài viết này không?
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
                onClick={handleConfirmDelete}
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

      {/* Add Post Dialog */}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Thêm bài viết mới
            </DialogTitle>
          </DialogHeader>

          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(onSubmitAdd)}
              className="space-y-4"
            >
              <FormField
                control={addForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung bài viết..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="viewer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chế độ hiển thị</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chế độ hiển thị" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Công khai</SelectItem>
                        <SelectItem value="FRIENDS">Bạn bè</SelectItem>
                        <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media Section */}
              <FormItem>
                <FormLabel>Hình ảnh & Video</FormLabel>
                <div className="space-y-4">
                  {/* Media previews */}
                  {addMediaPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {addMediaPreviews.map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === "image" ? (
                            <img
                              src={media.url}
                              alt={`Media ${index}`}
                              className="h-24 w-full rounded object-cover"
                            />
                          ) : (
                            <div className="relative flex h-24 w-full items-center justify-center rounded bg-gray-200">
                              <Film className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeAddMediaPreview(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <div className="flex w-full flex-col gap-2">
                    <input
                      type="file"
                      id="add-media"
                      ref={addFileInputRef}
                      accept="image/*,video/*"
                      onChange={handleAddMediaChange}
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addFileInputRef.current?.click()}
                      className="w-full"
                    >
                      Chọn ảnh hoặc video
                    </Button>
                  </div>
                </div>
              </FormItem>

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
