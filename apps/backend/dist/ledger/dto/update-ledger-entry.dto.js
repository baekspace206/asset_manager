"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLedgerEntryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ledger_entry_dto_1 = require("./create-ledger-entry.dto");
class UpdateLedgerEntryDto extends (0, mapped_types_1.PartialType)(create_ledger_entry_dto_1.CreateLedgerEntryDto) {
}
exports.UpdateLedgerEntryDto = UpdateLedgerEntryDto;
//# sourceMappingURL=update-ledger-entry.dto.js.map