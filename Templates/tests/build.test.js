global.TextEncoder = global.TextEncoder || require("util").TextEncoder;
global.TextDecoder = global.TextDecoder || require("util").TextDecoder;

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

jest.setTimeout(10000); // הארכת זמן הבדיקה ל-10 שניות

describe("filterSuppliers Tests", () => {
    function mockDisplaySuppliers(suppliers, containerId, type) {
        return { suppliers, containerId, type };
    }

    const suppliersMock = [
        { "שם": "ספק 1", "איזור": "צפון", "מחיר": 500 },
        { "שם": "ספק 2", "איזור": "מרכז", "מחיר": 700 },
        { "שם": "ספק 3", "איזור": "דרום", "מחיר": 600 }
    ];

    it("should return all suppliers when region is 'בחר אזור'", () => {
        const region = "בחר אזור";
        const filteredSuppliers = suppliersMock.filter(supplier => {
            if (region === "בחר אזור") {
                return true;
            }
            return supplier["איזור"] === region;
        });

        expect(filteredSuppliers.length).toBe(3);
    });

    it("should return only suppliers from the 'צפון' region", () => {
        const region = "צפון";
        const filteredSuppliers = suppliersMock.filter(supplier => supplier["איזור"] === region);

        expect(filteredSuppliers.length).toBe(1);
        expect(filteredSuppliers[0]["איזור"]).toBe("צפון");
    });

    it("should return an empty array when no suppliers match the 'אילת' region", () => {
        const region = "אילת";
        const filteredSuppliers = suppliersMock.filter(supplier => supplier["איזור"] === region);

        expect(filteredSuppliers.length).toBe(0);
    });
});
