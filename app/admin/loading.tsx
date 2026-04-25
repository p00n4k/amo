export default function AdminDashboardLoading() {
    return (
        <div className="animate-pulse">
            {/* Title */}
            <div className="h-8 w-48 bg-gray-200 rounded mb-6" />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                        <div className="h-8 w-16 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
