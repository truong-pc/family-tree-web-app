"use client"

import { useMyChart } from "@/hooks/use-chart-queries"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Chart {
  id: string
  name: string
  description: string
  is_public: boolean
}

export default function MyCharts() {
  const { data: charts = [], isLoading, error } = useMyChart()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 border border-destructive/20">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Không thể tải danh sách gia phả"}
        </p>
      </Card>
    )
  }

  // Handle both array and single object responses
  const chartArray = Array.isArray(charts) ? charts : (charts ? [charts] : [])

  if (chartArray.length === 0) {
    return (
      <Card className="p-12 text-center border border-border">
        <p className="text-muted-foreground mb-4">Bạn chưa có gia phả nào</p>
        <Button>+ Tạo Gia Phả Mới</Button>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chartArray.map((chart) => (
        <Card key={chart.id} className="p-6 border border-border hover:border-primary/50 transition-colors">
          <h3 className="text-lg font-semibold text-foreground mb-2">{chart.name}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{chart.description || "Không có mô tả"}</p>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                chart.is_public ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {chart.is_public ? "🔓 Công Khai" : "🔒 Riêng Tư"}
            </span>
            <Button variant="outline" size="sm">
              Chỉnh Sửa
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
