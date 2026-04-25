export default function BrandsLoading() {
    return (
        <div className="bg-brand-dark text-white min-h-screen animate-pulse">
            {/* Header */}
            <header className="bg-brand-dark-header flex items-center justify-between px-6 py-4">
                <div className="h-9 w-24 bg-gray-600 rounded-md" />
                <div className="h-6 w-20 bg-gray-600 rounded" />
            </header>

            {/* Main Type Tabs */}
            <div className="flex justify-center space-x-8 border-b border-gray-600 px-6 mt-4 pb-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-6 w-24 bg-gray-600 rounded" />
                ))}
            </div>

            {/* Type Filter */}
            <div className="flex justify-center flex-wrap gap-3 mt-6 px-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-9 w-20 bg-gray-600 rounded-md" />
                ))}
            </div>

            {/* Search */}
            <div className="px-6 mt-6">
                <div className="h-10 max-w-md mx-auto bg-gray-600 rounded-lg" />
            </div>

            {/* Brand Cards */}
            <div className="px-6 mt-6 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-40 bg-gray-600 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}
