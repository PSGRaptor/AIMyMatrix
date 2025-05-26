// app/src/renderer/lib/utils.ts
//--------------------------------------------------------------
// Minimal class-name merger used across components
//--------------------------------------------------------------
export function cn(...args: Array<string | undefined | false | null>) {
    return args.filter(Boolean).join(" ");
}