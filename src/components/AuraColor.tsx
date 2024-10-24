import { cn } from "@/lib/utils";

interface AuraColorProps {
    position: string;
    color: {
        primary: string;
        secondary: string;
    },
    preview?: boolean
}
export default function AuraColor({ color, position, preview = false }: AuraColorProps) {
    return (
        <div
            className={cn("w-full border-[#252525] h-full aspect-square rounded-t-sm flex items-center justify-center relative overflow-hidden mx-auto sm:ml-0", preview ? "border-4 border-b-0" : "rounded-sm")}
            style={{
                background: `radial-gradient(circle at ${position}, ${color.primary}, ${color.secondary})`,
            }}
        >
            <div
                className="absolute inset-0 opacity-[0.75] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    )
}