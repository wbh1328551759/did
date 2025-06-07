import React from 'react'

/**
 * 分页组件
 * @param {Object} props
 * @param {number} props.currentPage - 当前页码
 * @param {number} props.totalPages - 总页数
 * @param {number} props.totalCount - 总条目数
 * @param {number} props.pageSize - 每页条目数
 * @param {boolean} props.hasNextPage - 是否有下一页
 * @param {boolean} props.hasPrevPage - 是否有上一页
 * @param {Function} props.onPageChange - 页码变化回调
 * @param {Function} props.onPageSizeChange - 页大小变化回调
 * @param {Function} props.onFirstPage - 跳转首页回调
 * @param {Function} props.onLastPage - 跳转末页回调
 * @param {Function} props.onNextPage - 下一页回调
 * @param {Function} props.onPrevPage - 上一页回调
 * @param {boolean} props.showPageSizeSelector - 是否显示页大小选择器
 * @param {number[]} props.pageSizeOptions - 页大小选项
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onPageSizeChange,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPrevPage,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  // 计算显示的页码范围
  const getVisiblePages = () => {
    const delta = 2 // 当前页前后显示的页数
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }
    }

    return rangeWithDots
  }

  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages()
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="pagination-container flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border rounded-lg shadow-sm">
      {/* 分页信息 */}
      <div className="pagination-info text-sm text-gray-600">
        显示 {startItem}-{endItem} 条，共 {totalCount} 条
      </div>

      {/* 分页控制 */}
      <div className="pagination-controls flex items-center gap-2">
        {/* 首页 */}
        <button
          onClick={onFirstPage}
          disabled={!hasPrevPage}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          首页
        </button>

        {/* 上一页 */}
        <button
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          上一页
        </button>

        {/* 页码 */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm border rounded ${
                    page === currentPage
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 下一页 */}
        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          下一页
        </button>

        {/* 末页 */}
        <button
          onClick={onLastPage}
          disabled={!hasNextPage}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          末页
        </button>
      </div>

      {/* 页大小选择器 */}
      {showPageSizeSelector && (
        <div className="page-size-selector flex items-center gap-2 text-sm">
          <span className="text-gray-600">每页显示:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option} 条
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default Pagination 