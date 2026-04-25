export default function AboutLoading() {
    return (
        <div className="min-h-screen animate-pulse">
            {/* Hero */}
            <div className="bg-brand-page py-10 pt-35">
                <div className="flex justify-between max-w-6xl mx-auto px-4 items-start">
                    <div className="h-24 w-32 bg-gray-300 rounded-b-3xl" />
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-32 bg-gray-400 rounded" />
                        <div className="h-4 w-48 bg-gray-300 rounded" />
                    </div>
                    <div className="h-24 w-32 bg-gray-300 rounded-b-3xl" />
                </div>
            </div>

            {/* Content */}
            <div className="bg-brand-dark-alt">
                <div className="max-w-6xl mx-auto py-16 px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <div className="w-full aspect-[4/3] bg-gray-700 rounded-lg" />
                            <div className="w-full aspect-[4/3] bg-gray-700 rounded-lg" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-600 rounded w-full" />
                                <div className="h-4 bg-gray-600 rounded w-5/6" />
                                <div className="h-4 bg-gray-600 rounded w-4/6" />
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div>
                                <div className="h-6 bg-gray-600 rounded w-32 ml-auto mb-2" />
                                <div className="h-32 bg-gray-700 rounded w-full" />
                                <div className="space-y-2 mt-4">
                                    <div className="h-4 bg-gray-600 rounded w-full" />
                                    <div className="h-4 bg-gray-600 rounded w-5/6" />
                                </div>
                            </div>
                            <div className="w-full aspect-[3/4] bg-gray-700 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Quote */}
                <div className="bg-brand-dark-soft py-16 px-6 flex flex-col items-center gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`h-4 bg-gray-600 rounded ${i >= 2 ? 'w-48' : 'w-3/4 max-w-xl'}`} />
                    ))}
                </div>

                {/* Banner */}
                <div className="p-6">
                    <div className="h-[200px] bg-gray-700 rounded-2xl max-w-6xl mx-auto" />
                </div>

                {/* Map */}
                <div className="bg-brand-dark py-10 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="w-full aspect-[16/9] bg-gray-700 rounded-lg" />
                        <div className="flex flex-col items-center gap-2 mt-8">
                            <div className="h-4 w-80 bg-gray-600 rounded" />
                            <div className="h-4 w-48 bg-gray-600 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
