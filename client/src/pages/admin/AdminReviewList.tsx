import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "./AdminLayout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FeedStats {
  total: number;
  pending: number;
  live: number;
  reject: number;
}

interface AdminFeedItem {
  id: number;
  type: string;
  title: string;
  author: string;
  status: string;
  date: string;
  likes: number;
  comments: number;
}

interface AdminFeedResponse {
  items: AdminFeedItem[];
  total: number;
  page: number;
  hasMore: boolean;
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

export default function AdminReviewList() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: stats } = useQuery<FeedStats>({
    queryKey: ["/api/admin/feed/stats"],
  });

  const queryParams = new URLSearchParams({ page: String(page), limit: "20" });
  if (statusFilter !== "all") queryParams.set("status", statusFilter);
  if (typeFilter !== "all") queryParams.set("type", typeFilter);

  const { data, isLoading } = useQuery<AdminFeedResponse>({
    queryKey: ["/api/admin/feed", page, statusFilter, typeFilter],
    queryFn: async () => {
      const res = await fetch(`/api/admin/feed?${queryParams}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const statCards = [
    { label: "총 콘텐츠", value: stats?.total ?? 0, icon: "fa-file-lines", color: "text-gray-700", bg: "bg-gray-100" },
    { label: "심사대기", value: stats?.pending ?? 0, icon: "fa-clock", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "승인완료", value: stats?.live ?? 0, icon: "fa-check-circle", color: "text-green-600", bg: "bg-green-50" },
    { label: "반려", value: stats?.reject ?? 0, icon: "fa-times-circle", color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <AdminLayout>
      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                <i className={`fas ${card.icon}`} />
              </div>
              <div>
                <p className="text-[12px] text-gray-500">{card.label}</p>
                <p className="text-[20px] font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-gray-600">심사현황</span>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] h-9 text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">심사대기</SelectItem>
              <SelectItem value="live">승인완료</SelectItem>
              <SelectItem value="reject">반려</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-gray-600">콘텐츠유형</span>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] h-9 text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="claim">보상후기</SelectItem>
              <SelectItem value="product">가입후기</SelectItem>
              <SelectItem value="lounge">라운지</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto text-[13px] text-gray-500">
          총 <b className="text-gray-900">{data?.total ?? 0}</b>건
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[60px] text-center text-[12px]">ID</TableHead>
              <TableHead className="w-[80px] text-[12px]">유형</TableHead>
              <TableHead className="text-[12px]">제목</TableHead>
              <TableHead className="w-[80px] text-[12px]">작성자</TableHead>
              <TableHead className="w-[90px] text-center text-[12px]">상태</TableHead>
              <TableHead className="w-[90px] text-[12px]">작성일</TableHead>
              <TableHead className="w-[60px] text-center text-[12px]">공감</TableHead>
              <TableHead className="w-[60px] text-center text-[12px]">댓글</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((item) => {
                const statusInfo = statusLabels[item.status] || { label: item.status, variant: "secondary" as const };
                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                    onClick={() => setLocation(`/admin/review/${item.id}`)}
                  >
                    <TableCell className="text-center text-[12px] text-gray-500">{item.id}</TableCell>
                    <TableCell className="text-[12px]">
                      <span className="text-gray-600">{typeLabels[item.type] ?? item.type}</span>
                    </TableCell>
                    <TableCell className="text-[13px] font-medium text-gray-900 max-w-[300px] truncate">
                      {item.title}
                    </TableCell>
                    <TableCell className="text-[12px] text-gray-600">{item.author}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusInfo.variant} className="text-[10px]">
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[12px] text-gray-500">{item.date}</TableCell>
                    <TableCell className="text-center text-[12px] text-gray-500">{item.likes}</TableCell>
                    <TableCell className="text-center text-[12px] text-gray-500">{item.comments}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.total > 20 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-[13px] bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            이전
          </button>
          <span className="text-[13px] text-gray-600 px-3">
            {page} / {Math.ceil(data.total / 20)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.hasMore}
            className="px-3 py-1.5 text-[13px] bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
