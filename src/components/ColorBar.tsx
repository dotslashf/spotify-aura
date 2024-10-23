interface ColorBarProps {
    hex: string;
    height?: number;
    rounded?: string;
}
export default function ColorBar({ hex, height = 8, rounded = "md" }: ColorBarProps) {
    return (
        <div className={`w-full h-${height} rounded-${rounded}`} style={{
            backgroundColor: hex
        }} />
    )
}