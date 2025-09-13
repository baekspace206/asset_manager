"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerLog = exports.LedgerLogAction = void 0;
const typeorm_1 = require("typeorm");
var LedgerLogAction;
(function (LedgerLogAction) {
    LedgerLogAction["CREATE"] = "create";
    LedgerLogAction["UPDATE"] = "update";
    LedgerLogAction["DELETE"] = "delete";
})(LedgerLogAction || (exports.LedgerLogAction = LedgerLogAction = {}));
let LedgerLog = class LedgerLog {
    id;
    entryId;
    userId;
    username;
    action;
    description;
    amount;
    category;
    date;
    note;
    previousData;
    createdAt;
};
exports.LedgerLog = LedgerLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LedgerLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LedgerLog.prototype, "entryId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LedgerLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LedgerLog.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: LedgerLogAction
    }),
    __metadata("design:type", String)
], LedgerLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], LedgerLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], LedgerLog.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LedgerLog.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LedgerLog.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LedgerLog.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LedgerLog.prototype, "previousData", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LedgerLog.prototype, "createdAt", void 0);
exports.LedgerLog = LedgerLog = __decorate([
    (0, typeorm_1.Entity)()
], LedgerLog);
//# sourceMappingURL=ledger-log.entity.js.map