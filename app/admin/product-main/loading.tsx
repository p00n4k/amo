export default function AdminProductMainLoading() {
    return (
        <div className="animate-pulse">
            <div className="flex justify-between items-center mb-4">
                <div className="h-8 w-56 bg-gray-200 rounded" />
                <div className="h-9 w-32 bg-gray-200 rounded" />
            </div>

            <div className="bg-gray-100 rounded-t-lg p-3 flex gap-4 mb-1">
                {[60, 200, 120, 120, 80].map((w, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded" style={{ width: w }} />
                ))}
            </div>

            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center p-3 border-b border-gray-100">
                    <div className="h-4 w-[60px] bg-gray-200 rounded" />
                    <div className="h-4 w-[200px] bg-gray-200 rounded" />
                    <div className="h-4 w-[120px] bg-gray-200 rounded" />
                    <div className="h-4 w-[120px] bg-gray-200 rounded" />
                    <div className="flex gap-2">
                        <div className="h-7 w-8 bg-gray-200 rounded" />
                        <div className="h-7 w-8 bg-gray-200 rounded" />
                    </div>
                </div>
            ))}

            <div className="flex justify-end mt-4 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
                ))}
            </div>
        </div>
    );
}
