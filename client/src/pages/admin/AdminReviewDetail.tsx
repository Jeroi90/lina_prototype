import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "./AdminLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminFeedItem {
  id: number;
  type: string;
  cat: string;
  tags: string[];
  title: string;
  desc: string;
  author: string;
  badge: string;
  star: number;
  likes: number;
  comments: number;
  date: string;
  prodName: string | null;
  status: string;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "심사대기", variant: "outline" },
  live: { label: "승인완료", variant: "default" },
  reject: { label: "반려", variant: "destructive" },
};

const typeLabels: Record<string, string> = {
  claim: "보상후기",
  product: "가입후기",
  lounge: "라운지",
};

interface AdminReviewDetailProps {
  id: number;
}

export default function AdminReviewDetail({ id }: AdminReviewDetailProps) {
  const [, setLocation] = useLocation();
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [memo, setMemo] = useState("");

  const { data: item, isLoading } = useQuery<AdminFeedItem>({
    queryKey: ["/api/feed", String(id)],
  });

  useEffect(() => {
    if (item) {
      setEditTitle(item.title);
      setEditDesc(item.desc);
    }
  }, [item]);

  const updateMutation = useMutation({
    mutationFn: async (data: { title: string; desc: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/feed/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feed"] });
      alert("저장되었습니다.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest("PATCH", `/api/admin/feed/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed", String(id)] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feed/stats"] });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ title: editTitle, desc: editDesc });
  };

  const handleApprove = () => {
    statusMutation.mutate("live", {
      onSuccess: () => {
        alert("승인되었습니다.");
        setLocation("/admin");
      },
    });
  };

  const handleReject = () => {
    statusMutation.mutate("reject", {
      onSuccess: () => {
        alert("반려되었습니다.");
        setLocation("/admin");
      },
    });
  };

  if (isLoading || !item) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  const statusInfo = statusLabels[item.status] || { label: item.status, variant: "secondary" as const };

  return (
    <AdminLayout>
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLocation("/admin")}
          className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <i className="fas fa-arrow-left text-gray-600" />
        </button>
        <h2 className="text-[18px] font-bold text-gray-900">심사 상세</h2>
        <Badge variant={statusInfo.variant} className="ml-2">
          {statusInfo.label}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Content edit */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4">콘텐츠 정보</h3>

            <div className="grid grid-cols-3 gap-4 mb-6 text-[13px]">
              <div>
                <span className="text-gray-500 block mb-1">콘텐츠 유형</span>
                <span className="font-medium text-gray-900">{typeLabels[item.type] ?? item.type}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">작성자</span>
                <span className="font-medium text-gray-900">{item.author} ({item.badge})</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">작성일</span>
                <span className="font-medium text-gray-900">{item.date}</span>
              </div>
            </div>

            {item.prodName && (
              <div className="mb-4 text-[13px]">
                <span className="text-gray-500 block mb-1">관련 상품</span>
                <span className="font-medium text-gray-900">{item.prodName}</span>
              </div>
            )}

            {item.star > 0 && (
              <div className="mb-4 text-[13px]">
                <span className="text-gray-500 block mb-1">평점</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.star }).map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-sm" />
                  ))}
                  <span className="ml-1 font-medium text-gray-900">{item.star}점</span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <span className="text-[13px] text-gray-500 block mb-1">태그</span>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-[11px]">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <label className="text-[13px] font-medium text-gray-700 block mb-2">제목</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mb-4 text-[14px]"
              />
              <label className="text-[13px] font-medium text-gray-700 block mb-2">내용</label>
              <Textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={6}
                className="text-[14px]"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4">통계</h3>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i className="far fa-heart text-orange-500" />
                <span className="text-gray-600">공감</span>
                <span className="ml-auto font-bold text-gray-900">{item.likes}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i className="far fa-comment-dots text-blue-500" />
                <span className="text-gray-600">댓글</span>
                <span className="ml-auto font-bold text-gray-900">{item.comments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4">심사 처리</h3>

            <label className="text-[13px] font-medium text-gray-700 block mb-2">심사자 메모</label>
            <Textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              placeholder="심사 관련 메모를 입력하세요..."
              className="mb-4 text-[13px]"
            />

            <div className="space-y-2">
              <Button
                className="w-full bg-[#0055B8] hover:bg-blue-700"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                <i className="fas fa-save mr-2" />
                {updateMutation.isPending ? "저장 중..." : "저장"}
              </Button>

              {item.status !== "live" && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={statusMutation.isPending}
                >
                  <i className="fas fa-check mr-2" />
                  승인
                </Button>
              )}

              {item.status !== "reject" && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={statusMutation.isPending}
                >
                  <i className="fas fa-times mr-2" />
                  반려
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[14px] font-bold text-gray-900 mb-3">현재 상태</h3>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-500">상태</span>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ID</span>
                <span className="font-medium text-gray-900">#{item.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
