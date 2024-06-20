"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerListingDTO = void 0;
class customerListingDTO {
    constructor(obj) {
        this.startDate = (obj && (obj === null || obj === void 0 ? void 0 : obj.startDate)) ? obj.startDate : null;
        this.page = (obj && (obj === null || obj === void 0 ? void 0 : obj.page)) ? obj.page : 1;
        this.limit = (obj && (obj === null || obj === void 0 ? void 0 : obj.limit)) ? obj.limit : 15;
        this.endDate = (obj && (obj === null || obj === void 0 ? void 0 : obj.endDate)) ? obj.endDate : null;
        this.search = (obj && (obj === null || obj === void 0 ? void 0 : obj.search)) ? obj.search : '';
        this.selectedFilterType = (obj && (obj === null || obj === void 0 ? void 0 : obj.selectedFilterType)) ? obj.selectedFilterType : '';
    }
}
exports.customerListingDTO = customerListingDTO;
//# sourceMappingURL=customerListing.dto.js.map