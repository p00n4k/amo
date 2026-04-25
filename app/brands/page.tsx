"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BrandCard from "./BrandCard"; // Adjust this path based on where BrandCard is saved

// Types
interface Brand {
    brand_id: number;
    brand_name: string;
    main_type: string;
    type: string;
    image: string;
    brand_url?: string;
}

type MainType = "Surface" | "Furnishing" | "Other";

const formatTypeLabel = (type: string) => {
    const normalized = (type || "").toLowerCase();
    if (normalized === "furniture" || normalized === "furnishing") return "Furnishing";
    if (normalized === "other") return "Others";
    return type;
};

export default function BrandsSearchPage() {
    const [activeMainType, setActiveMainType] = useState<MainType>("Surface");
    const [activeType, setActiveType] = useState<string>("ALL");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Load when main type or type changes
    useEffect(() => {
        fetchTypes();
        fetchBrands();
    }, [activeMainType, activeType]);

    // ========================================
    // Load Types by main_type
    // ========================================
    const fetchTypes = async () => {
        let endpoint = "";

        if (activeMainType === "Surface") {
            endpoint = "/api/typesurface";
        } else if (activeMainType === "Furnishing") {
            endpoint = "/api/typefurnishing";
        } else {
            endpoint = "/api/typeother";
        }

        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            setTypes(data.types || []);
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    };

    // ========================================
    // Load Brands by main_type + type
    // ========================================
    const fetchBrands = async () => {
        setLoading(true);

        let endpoint = "";

        if (activeMainType === "Surface") {
            endpoint =
                activeType === "ALL"
                    ? "/api/brandsurfaceall"
                    : `/api/brandsurface?type=${activeType}`;
        } else if (activeMainType === "Furnishing") {
            endpoint =
                activeType === "ALL"
                    ? "/api/brandfurnishingall"
                    : `/api/brandfurnishing?type=${activeType}`;
        } else {
            endpoint =
                activeType === "ALL"
                    ? "/api/brandotherall"
                    : `/api/brandother?type=${activeType}`;
        }

        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            setBrands(data.brands || []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }

        setLoading(false);
    };

    // Search filter
    const filteredBrands = brands.filter((brand) => {
        const name = brand.brand_name?.toLowerCase() ?? "";
        const type = formatTypeLabel(brand.type || "").toLowerCase();
        const term = searchTerm.toLowerCase();

        return name.includes(term) || type.includes(term);
    });

    return (
        <div className="bg-[#3A3A3A] text-white min-h-screen">

            {/* ─── Navbar ─── */}
            <header className="sticky top-0 z-50 h-[75px] bg-[#444444] flex items-center px-6 gap-4">

                {/* Hamburger — mobile only */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                    className="md:hidden flex flex-col justify-center items-center w-[45px] h-[45px] gap-[6px] flex-shrink-0"
                >
                    <span className="block w-[22px] h-[3px] bg-[#F8F2E6] rounded" />
                    <span className="block w-[22px] h-[3px] bg-[#F8F2E6] rounded" />
                    <span className="block w-[22px] h-[3px] bg-[#F8F2E6] rounded" />
                </button>

                {/* Amo logo — mobile only, next to burger */}
                <span className="font-amo md:hidden text-white text-[30px] leading-[28px] tracking-[-0.3px]">Amo</span>

                {/* Back to Products */}
                <button
                    onClick={() => window.history.back()}
                    className="hidden md:flex items-center px-[18px] py-[10px] rounded-[20px] bg-[#F8F2E6] text-[#444444] font-medium text-base leading-[28px] whitespace-nowrap transition hover:bg-white"
                >
                    Back to Products
                </button>

                {/* Center nav links */}
                <nav className="hidden md:flex items-center gap-8 ml-4">
                    <Link href="/projects" className="text-[#F8F2E6] font-light text-base tracking-[-0.3px] hover:text-white transition">Projects</Link>
                    <Link href="/home" className="text-[#F8F2E6] font-light text-base tracking-[-0.3px] hover:text-white transition">Home</Link>
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Amo logo — desktop only */}
                <span className="font-amo hidden md:block text-white text-[30px] leading-[28px] tracking-[-0.3px]">Amo</span>

                {/* Vertical divider */}
                <div className="hidden md:block w-px h-12 bg-[#F8F2E6]/50" />

                {/* LINE icon */}
                <a
                    href="https://line.me/ti/p/~amocorner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex flex-shrink-0"
                >
                    <img src="/static/line.png" alt="LINE" className="w-8 h-8" />
                </a>

                {/* Get in touch */}
                <Link
                    href="/about"
                    className="hidden md:flex items-center px-[18px] py-[10px] rounded-[20px] bg-primary text-white font-medium text-base leading-[28px] whitespace-nowrap transition hover:bg-primary-hover"
                >
                    Get in touch
                </Link>
            </header>

            {/* Mobile slide-out menu */}
            <div className={`fixed inset-0 z-40 bg-[#444444] flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-6 right-6 text-[#F8F2E6] text-3xl leading-none"
                    aria-label="Close menu"
                >✕</button>

                <button
                    onClick={() => { window.history.back(); setIsMenuOpen(false); }}
                    className="flex items-center px-[18px] py-[10px] rounded-[20px] bg-[#F8F2E6] text-[#444444] font-medium text-xl"
                >
                    Back to Products
                </button>
                <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="text-[#F8F2E6] font-light text-2xl tracking-[-0.3px] hover:text-white transition">Projects</Link>
                <Link href="/home" onClick={() => setIsMenuOpen(false)} className="text-[#F8F2E6] font-light text-2xl tracking-[-0.3px] hover:text-white transition">Home</Link>
                <a
                    href="https://line.me/ti/p/~amocorner"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3"
                >
                    <img src="/static/line.png" alt="LINE" className="w-8 h-8" />
                    <span className="text-[#F8F2E6] text-lg">amocorner</span>
                </a>
                <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-[18px] py-[10px] rounded-[20px] bg-primary text-white font-medium text-xl hover:bg-primary-hover transition"
                >
                    Get in touch
                </Link>
            </div>

            {/* Main Type Tabs */}
            <div className="flex justify-center space-x-4 sm:space-x-8 border-b border-gray-600 px-4 sm:px-6 mt-4">
                {["Surface", "Furnishing", "Other"].map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setActiveMainType(type as MainType);
                            setActiveType("ALL");
                        }}
                        className={`pb-2 border-b-2 transition-colors ${activeMainType === type
                            ? "border-white font-semibold"
                            : "border-transparent text-gray-400 hover:text-white"
                            }`}
                    >
                        {formatTypeLabel(type)}
                    </button>
                ))}
            </div>

            {/* Type Filter */}
            <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mt-6 px-4 sm:px-6">
                <button
                    onClick={() => setActiveType("ALL")}
                    className={`px-4 py-2 rounded-md ${activeType === "ALL"
                        ? "bg-primary text-white"
                        : "bg-secondary/20 text-white hover:bg-secondary/40"
                        }`}
                >
                    ALL
                </button>
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-4 py-2 rounded-md ${activeType === type
                            ? "bg-primary text-white"
                            : "bg-secondary/20 text-white hover:bg-secondary/40"
                            }`}
                    >
                        {formatTypeLabel(type).toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="px-6 mt-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search brands or types (Furnishing, Others)..."
                    className="w-full max-w-md mx-auto block bg-[#2E2E2E] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
            </div>

            {/* Brand Cards */}
            <div className="px-6 mt-6 pb-12">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-40 bg-gray-600 rounded-lg" />
                        ))}
                    </div>
                ) : filteredBrands.length === 0 ? (
                    <p className="text-center py-20 text-gray-400">No brands found</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBrands.map((brand) => (
                            <BrandCard
                                key={brand.brand_id}
                                imageSrc={brand.image}
                                redirectUrl={brand.brand_url || "#"}
                                brandName={brand.brand_name}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}