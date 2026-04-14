import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationState = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

type PaginationProps = {
  pagination: PaginationState
  loading?: boolean
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  limits?: number[]
  label?: string
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages: Array<number | "..."> = [1]
  const left = Math.max(2, currentPage - 1)
  const right = Math.min(totalPages - 1, currentPage + 1)

  if (left > 2) pages.push("...")

  for (let page = left; page <= right; page += 1) {
    pages.push(page)
  }

  if (right < totalPages - 1) pages.push("...")
  pages.push(totalPages)

  return pages
}

export default function Pagination({
  pagination,
  loading = false,
  onPageChange,
  onLimitChange,
  limits = [10, 20, 50, 100],
  label = "records",
}: PaginationProps) {
  const totalPages = Math.max(1, pagination.totalPages || 1)
  const page = Math.min(Math.max(1, pagination.page || 1), totalPages)
  const start = pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1
  const end = pagination.total === 0 ? 0 : Math.min(pagination.total, page * pagination.limit)
  const pages = getVisiblePages(page, totalPages)

  return (
    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="text-sm font-semibold text-slate-600">
          Showing <span className="font-bold text-slate-900">{start}</span> -{" "}
          <span className="font-bold text-slate-900">{end}</span> of{" "}
          <span className="font-bold text-slate-900">{pagination.total}</span> {label}
        </div>

        {onLimitChange && (
          <select
            value={pagination.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={loading}
            className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {limits.map((limit) => (
              <option key={limit} value={limit}>
                {limit} / page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={loading}
              onClick={() => onPageChange(item)}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                item === page
                  ? "border border-orange-500 bg-orange-500 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:text-orange-600"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={loading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
