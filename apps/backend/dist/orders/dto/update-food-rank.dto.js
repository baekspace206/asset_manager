"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFoodRankDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_food_rank_dto_1 = require("./create-food-rank.dto");
class UpdateFoodRankDto extends (0, mapped_types_1.PartialType)(create_food_rank_dto_1.CreateFoodRankDto) {
}
exports.UpdateFoodRankDto = UpdateFoodRankDto;
//# sourceMappingURL=update-food-rank.dto.js.map