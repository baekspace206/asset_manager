"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ledger_service_1 = require("./ledger.service");
const ledger_controller_1 = require("./ledger.controller");
const ledger_entry_entity_1 = require("./entities/ledger-entry.entity");
const ledger_log_entity_1 = require("./entities/ledger-log.entity");
const users_module_1 = require("../users/users.module");
const audit_module_1 = require("../audit/audit.module");
let LedgerModule = class LedgerModule {
};
exports.LedgerModule = LedgerModule;
exports.LedgerModule = LedgerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ledger_entry_entity_1.LedgerEntry, ledger_log_entity_1.LedgerLog]),
            users_module_1.UsersModule,
            audit_module_1.AuditModule,
        ],
        controllers: [ledger_controller_1.LedgerController],
        providers: [ledger_service_1.LedgerService],
        exports: [ledger_service_1.LedgerService],
    })
], LedgerModule);
//# sourceMappingURL=ledger.module.js.map