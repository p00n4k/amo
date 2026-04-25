export default function ProjectDetailLoading() {
    return (
        <div className="bg-brand-dark-soft min-h-screen text-white animate-pulse overflow-x-hidden">
            {/* Header */}
            <header className="flex items-center px-8 py-4">
                <div className="h-10 w-40 bg-gray-600 rounded-full" />
            </header>

            {/* Title section */}
            <section className="px-12 pt-16 pb-10 space-y-3">
                <div className="h-14 w-80 bg-gray-600 rounded" />
                <div className="h-8 w-64 bg-gray-600 rounded" />
                <div className="h-4 w-40 bg-gray-600 rounded" />
            </section>

            {/* Image Slider */}
            <div className="px-8 mb-12">
                <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
                    <div className="w-1/4 h-64 bg-gray-600 rounded-lg opacity-50" />
                    <div className="w-2/4 h-96 bg-gray-600 rounded-2xl" />
                    <div className="w-1/4 h-64 bg-gray-600 rounded-lg opacity-50" />
                </div>
            </div>

            {/* Collection Carousel */}
            <div className="text-center mb-10">
                <div className="h-6 w-40 bg-gray-600 rounded mx-auto mb-4" />
                <div className="flex justify-center gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-32 h-20 bg-gray-600 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-brand-dark rounded-2xl p-6 mx-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-7 w-48 bg-gray-600 rounded" />
                    <div className="h-9 w-32 bg-gray-600 rounded-full" />
                </div>
                <div className="space-y-3">
                    <div className="h-8 bg-gray-600 rounded w-full" />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-12 bg-gray-700 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );
}
