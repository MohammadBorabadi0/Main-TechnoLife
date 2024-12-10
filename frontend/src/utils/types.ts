import { DiscountType } from "./enums";

export interface Favorites {
    products: string[];
}

export interface Banner {
    id: string;
    name: string;
    imageUrl: string;
    mobileImageUrl: string;
    url: string;
    selectedLocationBanner: string;
    isActive: boolean;
    createdAt: string;
    updateAt: string;
}

export interface Cart {
    _id: number;
    productId: string;
    quantity: number;
    colorId: string;
    discount: number;
    price: number;
}

export interface Brand {
    id: string;
    name: string;
    categories: {
        id: string;
        categoryId: string;
        imageUrl: string;
        isBest: boolean;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    imageUrl: string;
    iconUrl: string;
    subCategories: SubCategory[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SubCategory {
    name: string;
    items: string[];
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    mobile?: string;
    isAdmin: boolean;
    nationalCode?: string;
    cardNumber?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    id: string;
    color: string;
    imageUrl: string;
    price: string;
    stock: string;
    discount?: Discount;
}

export interface Attribute {
    id: string;
    name: string;
    option: string | boolean;
    optionType: "string" | "boolean";
}

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    positivePoints: string;
    negativePoints: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    brand: string;
    basePrice: string;
    isActive: boolean;
    description: string;
    orderCount?: number;
    discount: number;
    discountTime: number;
    stock: string;
    rating: number;
    images: Image[];
    attributes: Attribute[];
    reviews: Review[];
    createdAt: string;
    updatedAt: string;
}

export interface Color {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    user: {
        _id: string;
    };
    shippingAddress: {
        province: string;
        city: string;
        postalAddress: string;
        postalCode: string;
        quarter: string;
        houseNumber: number;
        phoneNumber: string;
    };
    paymentResult: {
        email_address: string;
        status: string;
    };
    orderItems: Array<{
        _id: string;
        name: string;
        quantity: number;
        image: string;
        price: number;
        color: string;
        product: string;
    }>;
    orderCode: string;
    trackingNumber: number;
    paymentMethod: string;
    sendCompany: string;
    totalPrices: number;
    totalPricesAfterDiscount: number;
    shippingCost: number;
    totalDiscountAmount: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    updatedAt: string;
    paidAt: string;
}

export interface AddressFormValues {
    firstname: string;
    lastname: string;
    phonenumber: string;
    province: string;
    city: string;
    quarter: string;
    postalAddress: string;
    housenumber: string;
    postalCode: string;
}

export interface ImageUpload {
    file: File | null;
    color: string;
    price: number;
    isSelected?: boolean;
}

export interface Discount {
    id: string;
    name: string;
    description?: string;
    discountValue: number;
    type: DiscountType;
    startDate?: Date;
    endDate?: Date;
    usageLimit: number;
    minimumPurchase: number;
    isActive: boolean;

    // Relationships
    products?: Product[];
    categories?: Category[];
    brands?: Brand[];
    colors?: Color[];

    createdAt: Date;
    updatedAt: Date;
}
