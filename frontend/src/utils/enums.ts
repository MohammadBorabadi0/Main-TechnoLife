export type BadgeVariant =
    | "info"
    | "warn"
    | "default"
    | "secondary"
    | "danger"
    | "destructive"
    | "success"
    | "outline";

export type ButtonVariant =
    | "info"
    | "warn"
    | "danger"
    | "success"
    | "secondary"
    | "primary";

export type Severity =
    | "success"
    | "info"
    | "warn"
    | "danger"
    | "secondary"
    | "help"
    | "contrast";

export type SelectedLocationBanner =
    | "slider"
    | "section-1"
    | "section-2"
    | "section-3";

export enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    AMOUNT = "AMOUNT",
}
