export default function ProjectsLoading() {
    return (
        <div className="bg-[#2d2d2d] min-h-screen text-white px-4 py-8 pt-35 animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-72 mb-4" />

            {/* Tabs */}
            <div className="flex space-x-12 mb-8 border-b border-gray-600 pb-3">
                <div className="h-7 w-32 bg-gray-600 rounded" />
                <div className="h-7 w-32 bg-gray-600 rounded" />
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg overflow-hidden">
                        <div className="h-60 bg-gray-600" />
                        <div className="p-4 space-y-2">
                            <div className="h-5 bg-gray-600 rounded w-3/4" />
                            <div className="h-4 bg-gray-600 rounded w-1/2" />
                            <div className="h-4 bg-gray-600 rounded w-full" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-10">
                <div className="h-9 w-24 bg-gray-600 rounded" />
                <div className="h-4 w-24 bg-gray-600 rounded" />
                <div className="h-9 w-24 bg-gray-600 rounded" />
            </div>
        </div>
    );
}
