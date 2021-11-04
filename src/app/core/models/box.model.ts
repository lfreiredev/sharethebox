import { SafeResourceUrl } from "@angular/platform-browser";

export interface Box {
    user_id: string;
    amount: number;
    width: number;
    height: number;
    length: number;
    imageUrl: string;
}

export interface BoxWithImage extends Box {
    image: SafeResourceUrl;
}