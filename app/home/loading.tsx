export default function HomeLoading() {
    return (
        <main className="min-h-screen animate-pulse">
            {/* Hero slider */}
            <div className="w-full h-[70vh] bg-gray-700" />

            {/* Quote section */}
            <div className="bg-gray-800 py-16 px-6 flex flex-col items-center gap-4">
                <div className="h-6 w-3/4 max-w-xl bg-gray-600 rounded" />
                <div className="h-4 w-1/2 max-w-md bg-gray-600 rounded" />
                <div className="h-4 w-2/5 max-w-sm bg-gray-600 rounded" />
            </div>

            {/* Signature Collections */}
            <div className="bg-gray-800 py-10 px-6">
                <div className="h-8 w-64 bg-gray-600 rounded mx-auto mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-44 bg-gray-700 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Last Projects */}
            <div className="bg-gray-900 py-10 px-6">
                <div className="h-8 w-48 bg-gray-700 rounded mx-auto mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg overflow-hidden">
                            <div className="h-56 bg-gray-700" />
                            <div className="bg-gray-800 p-4 space-y-2">
                                <div className="h-5 bg-gray-700 rounded w-3/4" />
                                <div className="h-4 bg-gray-700 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
