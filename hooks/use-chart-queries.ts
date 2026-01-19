"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

// Types
interface Chart {
  _id: string
  ownerId: string
  ownerName: string
  editors?: string[]
  name: string | null
  description: string | null
  published?: boolean
  createdAt: string
}

interface EditorInfo {
  _id: string
  full_name: string
  email: string
}

// Query Keys
export const chartKeys = {
  all: ["charts"] as const,
  myChart: () => [...chartKeys.all, "my"] as const,
  editedCharts: () => [...chartKeys.all, "edited"] as const,
  publishedCharts: () => [...chartKeys.all, "published"] as const,
  editors: (chartId: string) => [...chartKeys.all, "editors", chartId] as const,
}

/**
 * Hook để lấy danh sách gia phả được chia sẻ (edited charts)
 */
export function useEditedCharts() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  return useQuery({
    queryKey: chartKeys.editedCharts(),
    queryFn: async () => {
      if (!token) {
        throw new Error("Vui lòng đăng nhập để xem danh sách gia phả được chia sẻ")
      }
      const data = await api.getEditedCharts(token)
      return (data || []) as Chart[]
    },
    enabled: !!token,
  })
}

/**
 * Hook để lấy danh sách gia phả công khai
 */
export function usePublishedCharts() {
  return useQuery({
    queryKey: chartKeys.publishedCharts(),
    queryFn: async () => {
      const data = await api.getPublishedCharts()
      return (data || []) as Chart[]
    },
  })
}

/**
 * Hook để lấy gia phả của người dùng hiện tại
 */
export function useMyChart() {
  const { token } = useAuth()

  return useQuery({
    queryKey: chartKeys.myChart(),
    queryFn: async () => {
      if (!token) {
        throw new Error("Phiên đăng nhập hết hạn")
      }
      return await api.getMyChart(token)
    },
    enabled: !!token,
  })
}

/**
 * Hook để lấy thông tin các editor của một gia phả
 */
export function useEditors(editorIds: string[]) {
  const { token } = useAuth()

  return useQuery({
    queryKey: chartKeys.editors(editorIds.join(",")),
    queryFn: async () => {
      if (!token || editorIds.length === 0) {
        return [] as EditorInfo[]
      }
      const promises = editorIds.map((userId) => api.getEditorName(token, userId))
      return await Promise.all(promises)
    },
    enabled: !!token && editorIds.length > 0,
  })
}

/**
 * Hook để tạo gia phả mới
 */
export function useCreateChart() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      if (!token) {
        throw new Error("Phiên đăng nhập hết hạn")
      }
      return await api.createChart(token, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chartKeys.myChart() })
    },
  })
}

/**
 * Hook để cập nhật gia phả
 */
export function useUpdateChart() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      chartId,
      data,
    }: {
      chartId: string
      data: { name: string; description: string; published: boolean }
    }) => {
      if (!token) {
        throw new Error("Phiên đăng nhập hết hạn")
      }
      return await api.updateChart(token, chartId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chartKeys.myChart() })
      queryClient.invalidateQueries({ queryKey: chartKeys.publishedCharts() })
    },
  })
}

/**
 * Hook để xóa gia phả
 */
export function useDeleteChart() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (chartId: string) => {
      if (!token) {
        throw new Error("Phiên đăng nhập hết hạn")
      }
      return await api.deleteChart(token, chartId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chartKeys.myChart() })
    },
  })
}

/**
 * Hook để thêm editor
 */
export function useAddEditor() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chartId, email }: { chartId: string; email: string }) => {
      if (!token) {
        throw new Error("Phiên đăng nhập hết hạn")
      }
      return await api.addEditor(token, chartId, email)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chartKeys.myChart() })
    },
  })
}

/**
 * Hook để xóa editor
 */
export function useRemoveEditor() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chartId, email }: { chartId: string; email: string }) => {
      if (!token) {
        throw new Error("Phiên đăng nhập hết hạn")
      }
      return await api.removeEditor(token, chartId, email)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chartKeys.myChart() })
    },
  })
}
