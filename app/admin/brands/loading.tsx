export default function AdminBrandsLoading() {
    return (
        <div className="animate-pulse">
            {/* Header row */}
            <div className="flex justify-between items-center mb-4">
                <div className="h-8 w-52 bg-gray-200 rounded" />
                <div className="h-9 w-28 bg-gray-200 rounded" />
            </div>

            {/* Table header */}
            <div className="bg-gray-100 rounded-t-lg p-3 flex gap-4 mb-1">
                {[70, 100, 80, 160, 120, 120, 200, 120].map((w, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded" style={{ width: w }} />
                ))}
            </div>

            {/* Table rows */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center p-3 border-b border-gray-100">
                    <div className="h-4 w-[70px] bg-gray-200 rounded" />
                    <div className="h-6 w-[100px] bg-gray-200 rounded-full" />
                    <div className="h-12 w-[80px] bg-gray-200 rounded" />
                    <div className="h-4 w-[160px] bg-gray-200 rounded" />
                    <div className="h-4 w-[120px] bg-gray-200 rounded" />
                    <div className="h-4 w-[120px] bg-gray-200 rounded" />
                    <div className="h-4 w-[200px] bg-gray-200 rounded" />
                    <div className="flex gap-2">
                        <div className="h-7 w-8 bg-gray-200 rounded" />
                        <div className="h-7 w-8 bg-gray-200 rounded" />
                    </div>
                </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-end mt-4 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
                ))}
            </div>
        </div>
    );
}
