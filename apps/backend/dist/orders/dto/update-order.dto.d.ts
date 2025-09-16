import { CreateOrderDto } from './create-order.dto';
declare const UpdateOrderDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateOrderDto>>;
export declare class UpdateOrderDto extends UpdateOrderDto_base {
}
export declare class CompleteOrderDto {
    completedImage?: string;
    completedComment?: string;
    restaurantName: string;
    foodImage: string;
    rating: number;
    rankComment?: string;
}
export {};
